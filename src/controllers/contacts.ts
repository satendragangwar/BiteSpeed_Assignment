import { Request, Response } from "express";
import { eq, or, desc, asc } from "drizzle-orm"; // Import 'asc' for ascending order
import { db, contacts } from "../db";

interface ConsolidatedContact {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export const identifyContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phoneNumber } = req.body;

    // Find all contacts that match either email or phone number, ordered by createdAt ASC (oldest first)
    const matchingContacts = await db
      .select()
      .from(contacts)
      .where(
        or(eq(contacts.email, email), eq(contacts.phoneNumber, phoneNumber))
      )
      .orderBy(asc(contacts.createdAt)); // Order by createdAt in ascending order (oldest first)

    let primaryContact; // Declare primaryContact outside the if block

    if (matchingContacts.length === 0) {
      // Create new primary contact if no matching contacts found
      const [newContact] = await db
        .insert(contacts)
        .values({
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkPrecedence: "primary",
        })
        .returning();

      primaryContact = newContact; // Assign new primary contact
      res.json({
        contact: {
          primaryContactId: newContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      });
      return; // Return early as it's a new primary contact
    } else {
      // Matching contacts found

      // Find the oldest primary contact among matching contacts
      primaryContact =
        matchingContacts.find(
          (contact) => contact.linkPrecedence === "primary"
        ) || matchingContacts[0]; // If primary exists, use it, otherwise use the oldest (first in ASC order)

      // Check if we need to create a new secondary contact
      const existingContactWithEmail = matchingContacts.some(
        (c) => c.email === email
      );
      const existingContactWithPhone = matchingContacts.some(
        (c) => c.phoneNumber === phoneNumber
      );

      if (!existingContactWithEmail || !existingContactWithPhone) {
        // Create new secondary contact linking to the primary contact
        await db.insert(contacts).values({
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        });
      }


      // Consolidate all related contacts (including the newly created secondary if any)
      const allRelatedContacts = await db
        .select()
        .from(contacts)
        .where(
          or(
            eq(contacts.id, primaryContact.id),
            eq(contacts.linkedId, primaryContact.id)
          )
        );

      // Create consolidated response
      const consolidatedContact: ConsolidatedContact = {
        primaryContactId: primaryContact.id,
        emails: [
          ...new Set(
            allRelatedContacts
              .map((c) => c.email)
              .filter((email): email is string => email !== null)
          ),
        ],
        phoneNumbers: [
          ...new Set(
            allRelatedContacts
              .map((c) => c.phoneNumber)
              .filter((phone): phone is string => phone !== null)
          ),
        ],
        secondaryContactIds: allRelatedContacts
          .filter((c) => c.linkPrecedence === "secondary")
          .map((c) => c.id),
      };

      res.json({ contact: consolidatedContact });
    }
  } catch (error) {
    console.error("Error in identifyContact:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
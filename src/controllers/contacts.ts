import { Request, Response } from "express";
import { eq, or, desc, asc } from "drizzle-orm";
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

    const matchingContacts = await db
      .select()
      .from(contacts)
      .where(
        or(eq(contacts.email, email), eq(contacts.phoneNumber, phoneNumber))
      )
      .orderBy(asc(contacts.createdAt)); 

    let primaryContact; 

    if (matchingContacts.length === 0) {
      
      const [newContact] = await db
        .insert(contacts)
        .values({
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkPrecedence: "primary",
        })
        .returning();

      primaryContact = newContact; 
      res.json({
        contact: {
          primaryContactId: newContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      });
      return; 
    } else {
      

    
      primaryContact =
        matchingContacts.find(
          (contact) => contact.linkPrecedence === "primary"
        ) || matchingContacts[0]; 

      
      const existingContactWithEmail = matchingContacts.some(
        (c) => c.email === email
      );
      const existingContactWithPhone = matchingContacts.some(
        (c) => c.phoneNumber === phoneNumber
      );

      if (!existingContactWithEmail || !existingContactWithPhone) {
        
        await db.insert(contacts).values({
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        });
      }


      
      const allRelatedContacts = await db
        .select()
        .from(contacts)
        .where(
          or(
            eq(contacts.id, primaryContact.id),
            eq(contacts.linkedId, primaryContact.id)
          )
        );

      
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
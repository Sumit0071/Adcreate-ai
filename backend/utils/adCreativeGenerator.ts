import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

export interface AdData {
  businessname: string;
  niche: string;
  productService: string;
  adGoal: string;
  targetAudience: string;
  contextImage?: string; // Optional field for context image URL
  specialInstructions?: string; // Optional field for any special instructions
}

const geminiApiKey = process.env.GEMINI_API_KEY;
if ( !geminiApiKey ) {
  throw new Error( "❌ Gemini API key is not set in environment variables." );
}

const ai = new GoogleGenAI( { apiKey: geminiApiKey } );

// Helper: wait function
const wait = ( ms: number ) => new Promise( ( res ) => setTimeout( res, ms ) );

// Generic retry wrapper
async function withRetry<T>( fn: () => Promise<T>, retries = 3 ): Promise<T> {
  while ( retries > 0 ) {
    try {
      return await fn();
    } catch ( error: any ) {
      if ( error.status === 429 ) {
        const retryDelay =
          error.retryDelay ? parseInt( error.retryDelay ) * 1000 : 15000;
        console.warn( `⚠️ Rate limited. Retrying in ${retryDelay / 1000}s...` );
        await wait( retryDelay );
        retries--;
      } else {
        throw error;
      }
    }
  }
  throw new Error( "❌ Failed after multiple retries due to rate limits." );
}

export const generateAdsequence = async ( data: AdData ) => {
  const { businessname, niche, productService, adGoal, targetAudience, contextImage, specialInstructions } = data;

  // Step 1: Generate ad copy (text)
  const textPrompt = `
You are an expert Facebook ad copywriter. Write **3 distinct ad copy options** for the business "${businessname}".

Business Context:
- Niche: ${niche}
- Product/Service: ${productService}
- Advertising Goal: ${adGoal}
- Target Audience: ${targetAudience}
${specialInstructions ? `- Special Instructions: ${specialInstructions}` : ""}
For each option, provide:
1. **Headline**
2. **Body Text**
3. **CTA**

Style Guidelines:
${niche === "Restaurant" ? "- Make it appetizing, sensory-rich, and emotional" : ""}
${niche === "Software" ? "- Highlight efficiency, scalability, and innovation" : ""}
${niche === "E-commerce" ? "- Focus on deals, lifestyle appeal, and urgency" : ""}
${niche === "Health & Fitness" ? "- Use motivational, energetic tone" : ""}
${niche === "Education Technology" ? "- Highlight learning, growth, and ease of use" : ""}
${niche === "Travel Agency" ? "- Inspire wanderlust with vivid imagery" : ""}

Requirements:
- Each option should feel unique.
- Tone should directly appeal to ${targetAudience}.
- Keep copy concise, persuasive, and optimized for Facebook ads.
`;

  const textResponse = await withRetry( () =>
    ai.models.generateContent( {
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: textPrompt }] }],
    } )
  );

  let adCopy = "";
  const textParts = textResponse.candidates?.[0]?.content?.parts ?? [];
  for ( const part of textParts ) {
    if ( part.text ) {
      adCopy += part.text + "\n";
    }
  }
  adCopy = adCopy.trim();

  if ( adCopy ) {
    console.log( "\n📢 Generated Ad Copy:\n" );
    console.log( adCopy );
  } else {
    console.warn( "⚠️ No ad copy generated." );
  }

  // Step 2: Generate ad creative (image)
  const imagePrompt = `
Create a **Facebook ad banner** for the business: "${businessname}".

Business Context:
- Niche: ${niche}
- Product/Service: ${productService}
- Goal: ${adGoal}
- Target Audience: ${targetAudience}
${specialInstructions ? `- Special Instructions: ${specialInstructions}` : ""}
${contextImage ? `- Use this image as inspiration/reference while generating the image: ${contextImage}` : ""}

Banner Requirements:
- Prominently display business name: "${businessname}"
- Visually represent: ${productService}
- Emphasize the goal with strong CTA text (e.g., "${adGoal}")
- Style should match the niche:
   ${niche === "Restaurant" ? "- Warm colors (red, orange, gold), appetizing food imagery" : ""}
   ${niche === "Software" ? "- Sleek, modern, tech visuals in blue/white tones" : ""}
   ${niche === "E-commerce" ? "- Bright lifestyle visuals, shopping icons" : ""}
   ${niche === "Health & Fitness" ? "- Energetic workout imagery, green/black tones" : ""}
   ${niche === "Education Technology" ? "- Books, laptops, learning visuals" : ""}
   ${niche === "Travel Agency" ? "- Beaches, landmarks, inspiring visuals" : ""}

General Design Guidelines:
- Modern, professional, and visually striking
- Include ${businessname} logo placeholder (top corner) or anywhere you usually place logos
- Use high-quality, relevant imagery (avoid generic stock photos)
- Colors that evoke the right emotions for ${targetAudience}
- Bold, readable fonts with strong contrast
- Optimized for Facebook ad dimensions (1200x628 px)
- Clean layout that grabs attention but avoids clutter
`;

  let imageBuffer: Buffer | null = null;
  try {
    const imageResponse = await withRetry( () =>
      ai.models.generateContent( {
        model: "gemini-2.5-flash-image-preview",
        contents: [{ role: "user", parts: [{ text: imagePrompt }] }]
      } )
    );

    const imageParts = imageResponse.candidates?.[0]?.content?.parts ?? [];
    for ( const part of imageParts ) {
      if ( part.inlineData?.data ) {
        imageBuffer = Buffer.from( part.inlineData.data, "base64" ); // assign here
        const fileName = "facebook-ad-creative.png";
        fs.writeFileSync( fileName, imageBuffer );
        console.log( `✅ Image saved as ${fileName}` );
      }
    }

    if ( !imageBuffer ) {
      console.warn( "⚠️ No image was generated by Gemini." );
    }
  } catch ( err: any ) {
    console.error( err );
    console.warn( "⚠️ Image generation skipped — quota exceeded or API error." );
  }

  return {
    adCopies: adCopy.match( /(\*\*Option[\s\S]*?)(?=\n\*\*Option|\n\*\*Expert|$)/g ) || [],
    imageBase64: imageBuffer ? imageBuffer.toString( "base64" ) : null,
  };

};
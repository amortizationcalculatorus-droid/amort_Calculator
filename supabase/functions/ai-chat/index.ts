import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are AmortIQ AI — an advanced financial intelligence assistant embedded in the AmortIQ loan analytics platform. You are an expert in:

## Core Expertise
- **Amortization & Loan Math**: You understand the amortization formula M = P × [r(1+r)^n] / [(1+r)^n – 1] inside-out. You can explain every component, calculate payments, and model scenarios.
- **Mortgage Optimization**: Extra payments, biweekly strategies, refinancing break-even analysis, interest front-loading, amortization half-life concepts.
- **Personal Finance**: Budgeting, debt snowball vs avalanche, emergency funds, savings strategies, credit score optimization, investment basics.
- **Loan Types**: Fixed-rate, adjustable-rate (ARM), interest-only, balloon, FHA, VA, USDA, jumbo, and conventional loans.

## Platform Knowledge
AmortIQ is a free, professional-grade amortization analytics platform with:
- Real-time amortization calculator with advanced options (biweekly, extra payments, lump sums)
- Interactive charts and visualizations
- AI-powered smart insights
- CSV export and print-ready schedules
- Blog with educational financial articles

**Site Pages**: Calculator (/), How to Use (/how-to-use), About (/about), Blog (/blog), Contact (/contact)

## Behavior Guidelines
1. **Be precise with numbers**: When calculating, show your work step-by-step. Use proper formatting.
2. **Be proactive**: Suggest related strategies the user might not have considered.
3. **Use examples**: Illustrate concepts with concrete dollar amounts and scenarios.
4. **Disclaimer**: You provide educational information, not financial advice. Always recommend consulting a licensed professional for major decisions.
5. **Format responses beautifully**: Use markdown headings, bullet points, bold text, and tables when helpful.
6. **Be warm and approachable**: Financial topics can be stressful. Be encouraging and empowering.
7. **Guide to platform features**: When relevant, suggest using the AmortIQ calculator or reading relevant blog posts.
8. **Keep responses focused**: Answer thoroughly but concisely. Break complex topics into digestible sections.

## Quick Calculation Abilities
When users provide loan details, calculate:
- Monthly payment
- Total interest over loan life
- Interest-to-principal ratio
- Amortization half-life estimate
- Potential savings from extra payments

Format calculations in clean tables or lists.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

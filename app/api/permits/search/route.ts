import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const permitSearchSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  zipCode: z.string().optional(),
  city: z.string().optional(),
})

/**
 * Permit Lookup API
 * 
 * Currently returns a "not configured" response.
 * To enable real permit lookup, configure one of:
 * - PERMIT_API_KEY (for permit lookup service)
 * - PERMIT_API_URL (for custom permit API)
 * 
 * See ENVIRONMENT.md for setup instructions.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireUser()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const data = permitSearchSchema.parse(body)

    // Check if permit lookup is configured
    const permitApiKey = process.env.PERMIT_API_KEY
    const permitApiUrl = process.env.PERMIT_API_URL

    if (!permitApiKey && !permitApiUrl) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Permit lookup is not yet configured. This feature requires API access to local permit databases.',
        requiresSetup: true,
        setupInstructions: [
          'Contact your jurisdiction to obtain API access',
          'Configure PERMIT_API_KEY or PERMIT_API_URL in environment variables',
          'See ENVIRONMENT.md for detailed setup instructions',
        ],
      })
    }

    // TODO: Implement actual permit lookup when API is configured
    // Example implementation:
    // const response = await fetch(`${permitApiUrl}/search`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${permitApiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     address: data.address,
    //     zipCode: data.zipCode,
    //     city: data.city,
    //   }),
    // })
    // const permits = await response.json()

    return NextResponse.json({
      success: false,
      configured: true,
      message: 'Permit lookup API is configured but not yet implemented.',
      requiresSetup: false,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error searching permits:', error)
    return NextResponse.json(
      { error: 'Failed to search permits' },
      { status: 500 }
    )
  }
}

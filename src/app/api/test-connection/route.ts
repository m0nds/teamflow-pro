import { NextResponse } from 'next/server'

export async function GET() {
  const timestamp = new Date().toISOString()
  
  console.log('🧪 CONNECTION TEST AT:', timestamp)
  
  // This should fail without internet
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Internet connection confirmed!',
      timestamp,
      externalData: data.title
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'No internet connection!',
      timestamp,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })  }
}

/**
 * Proof of Delivery API
 * POST /api/orders/:id/proof
 * Upload proof photo for pickup or delivery
 */

import { requireAuth } from '../../../../utils/auth';
import { getCorsHeaders } from '../../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../../utils/response';

// In production, this would upload to cloud storage (S3, GCS, etc.)
// For now, we'll accept the file and return a mock URL
async function uploadToStorage(file: File): Promise<string> {
  // Generate a unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `proof_${timestamp}_${randomStr}.${extension}`;

  // In production, upload to cloud storage here
  // Example with AWS S3:
  // const s3 = new S3Client({ region: process.env.AWS_REGION });
  // await s3.send(new PutObjectCommand({
  //   Bucket: process.env.S3_BUCKET,
  //   Key: `proofs/${filename}`,
  //   Body: Buffer.from(await file.arrayBuffer()),
  //   ContentType: file.type,
  // }));
  // return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/proofs/${filename}`;

  // For development, we'll use a data URL approach or local storage
  // Return a mock URL for now
  return `/uploads/proof/${filename}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Parse multipart form data
    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;
    const type = formData.get('type') as 'pickup' | 'delivery' | null;

    if (!photo) {
      return errorResponse('Photo file is required', 400);
    }

    if (!type || !['pickup', 'delivery'].includes(type)) {
      return errorResponse('Type must be "pickup" or "delivery"', 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(photo.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.', 400);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
      return errorResponse('File size exceeds 5MB limit', 400);
    }

    // Upload to storage
    const proofUrl = await uploadToStorage(photo);

    // In production, you might want to store this in a database
    // For now, we'll just return success
    // Example with Prisma - you could add a ProofOfDelivery model:
    // await prisma.proofOfDelivery.create({
    //   data: {
    //     id_order: id,
    //     type: type,
    //     photo_url: proofUrl,
    //     uploaded_by: authResult.user.id_user,
    //   }
    // });

    return jsonResponse({
      success: true,
      message: 'Proof uploaded successfully',
      data: {
        order_id: id,
        type: type,
        proof_url: proofUrl,
        filename: photo.name,
        size: photo.size,
      }
    });
  } catch (error) {
    console.error('[Proof] POST error:', error);
    return errorResponse('Internal server error', 500);
  }
}

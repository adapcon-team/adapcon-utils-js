import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class S3Service {
  static async putObject ({
    bucket,
    key,
    body,
    metadata,
    storageClass,
    tagging,
    contentType = '',
    contentEncoding = '',
    region = 'sa-east-1'
  }) {
    const client = new S3Client({ region })

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      Metadata: metadata,
      StorageClass: storageClass,
      ContentType: contentType,
      ContentEncoding: contentEncoding,
      Tagging: tagging
    })

    const data = await client.send(command)

    return data
  }

  static async getObject ({ bucket, key, region = 'sa-east-1' }) {
    const client = new S3Client({ region })

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })

    const data = await client.send(command)

    return data
  }

  static async deleteObject ({ bucket, region = 'sa-east-1' }) {
    const client = new S3Client({ region })

    const command = new DeleteBucketCommand({
      Bucket: bucket
    })

    const data = await client.send(command)

    return data
  }

  static async getSignedUrl ({
    bucket, key, contentType = '', region = 'sa-east-1', expiresIn = 60
  }) {
    const client = new S3Client({ region })

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentType: contentType
    })

    const url = await getSignedUrl(client, command, { expiresIn })

    return url
  }
}

interface PendingUpload {
  file: File
  userId: string
  token?: string
}

let pending: PendingUpload | null = null

export function setPendingUpload(data: PendingUpload) { pending = data }
export function getPendingUpload() { return pending }
export function clearPendingUpload() { pending = null }

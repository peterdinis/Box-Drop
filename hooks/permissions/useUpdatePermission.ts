import { useMutation } from '@tanstack/react-query'

type UpdatePermissionInput = {
  userId: string
  targetId: string
  targetType: 'file' | 'folder'
  access: 'read' | 'write'
}

export function useUpdatePermission() {
  return useMutation({
    mutationFn: async ({
      userId,
      targetId,
      targetType,
      access,
    }: UpdatePermissionInput) => {
      const res = await fetch(`/api/permissions/${userId}/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, access }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update permission')
      }

      return res.json()
    },
  })
}
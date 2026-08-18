export const mockUsers = [
  {
    id: 'viewer-1',
    name: 'Viewer Demo',
    email: 'viewer@demo.com',
    password: 'Viewer123!',
    role: 'read-only',
    mfaCode: '123456',
  },
  {
    id: 'editor-1',
    name: 'Editor Demo',
    email: 'editor@demo.com',
    password: 'Editor123!',
    role: 'read-write',
    mfaCode: '654321',
  },
]

export const defaultMfaCode = '123456'

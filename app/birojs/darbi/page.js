import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Darbi merged into Darbu kalendārs (list view) — this route only exists
// so any old bookmarks don't 404.
export default function Darbi() {
  redirect('/birojs/kalendars?view=list')
}

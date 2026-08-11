import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  contentMarkdown: string;
  imageUrl?: string;
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
};

// Wpis jest naprawdę widoczny publicznie dopiero, gdy jest opublikowany I
// minęła jego (ewentualnie zaplanowana na przyszłość) data publikacji —
// pozwala to zaplanować publikację z wyprzedzeniem w panelu najmu.
function isLive(post: BlogPost): boolean {
  return post.status === "published" && !!post.publishedAt && post.publishedAt <= Date.now();
}

// Tylko opublikowane wpisy — zgodnie z regułami Firestore (firestore.rules),
// filtr status=="published" jest tu wymagany, żeby zapytanie było dozwolone
// bez zalogowania (reguła "list" musi dać się udowodnić z samego zapytania).
// Reguła "list" nie sprawdza daty publikacji, więc zaplanowane-na-przyszłość
// wpisy odsiewamy tutaj, po stronie klienta.
export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, "posts"), where("status", "==", "published"));
  const snap = await getDocs(q);
  const posts = snap.docs.map((d) => d.data() as BlogPost).filter(isLive);
  posts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  return posts;
}

export async function fetchPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, "posts", slug));
  if (!snap.exists()) return null;
  const data = snap.data() as BlogPost;
  if (!isLive(data)) return null;
  return data;
}

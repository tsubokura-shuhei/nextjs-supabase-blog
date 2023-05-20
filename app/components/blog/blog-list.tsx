import { notFound } from "next/navigation";
import { createClient } from "../../../utils/supabase-server";

import BlogItem from "./blog-item";

//ブログリスト
const BlogList = async () => {
  const supabase = createClient();

  //ブログリスト
  const { data: blogsData } = await supabase
    .from("blogs")
    .select()
    .order("created_at", { ascending: false });

  //ブログリストが見つからない場合
  if (!blogsData) return notFound();

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* mapでasync/awaitを使用するためにPrimise.allを使用 */}
      {await Promise.all(
        blogsData.map(async (blogsData) => {
          //プロフィール取得
          const { data: userData } = await supabase
            .from("profiles")
            .select()
            .eq("id", blogsData.user_id)
            .single();

          //ブログとプロフィールのテーブルを結合
          const blog = {
            id: blogsData.id,
            created_at: blogsData.created_at,
            title: blogsData.title,
            content: blogsData.content,
            user_id: blogsData.user_id,
            image_url: blogsData.image_url,
            name: userData!.name,
            avatar_url: userData!.avatar_url,
          };

          return <BlogItem key={blog.id} {...blog} />;
        })
      )}
    </div>
  );
};

export default BlogList;

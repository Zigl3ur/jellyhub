export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return <div>Item: {decodeURIComponent(slug).replaceAll("-", " ")}</div>;
}

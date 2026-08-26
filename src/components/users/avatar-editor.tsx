import { useRef, type ChangeEvent, type InputHTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImg } from "../ui/avatar";
import Button from "../ui/button";
import { Trash } from "lucide-react";

interface AvatarEditorProps extends InputHTMLAttributes<HTMLInputElement> {
  image: string | null;
  username: string;
  onEdit: (result: string | null) => void;
  onFailed: (err: Error | undefined) => void;
}

export default function AvatarEditor({
  image,
  username,
  onEdit,
  onFailed,
  onChange,
  ...props
}: AvatarEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0];

      if (image.size > 10_000_000) {
        onFailed(new Error("File exceed size limit of 10MB"));
        return;
      }

      onFailed(undefined);

      const reader = new FileReader();

      reader.readAsDataURL(image);
      reader.addEventListener("load", () => {
        const result = reader.result;
        if (!result) return;

        onEdit(result.toString());
      });
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/jpeg, image/png, image/jpg, image/webp, image/gif"
        hidden
        multiple={false}
        ref={inputRef}
        onChange={(e) => {
          handleFileChange(e);
          onChange?.(e);
        }}
        {...props}
      />
      <Avatar
        onClick={() => inputRef.current?.click()}
        className="size-24 hover:cursor-pointer relative"
      >
        <AvatarImg src={image as string} />
        <AvatarFallback delay={500} className="text-2xl">
          {username?.charAt(0).toUpperCase()}
        </AvatarFallback>

        {image && (
          <Button
            className="absolute top-1 right-1"
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(null);
            }}
          >
            <Trash />
          </Button>
        )}
      </Avatar>
    </>
  );
}

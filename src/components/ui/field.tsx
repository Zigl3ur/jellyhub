import { Field } from "@base-ui/react";

export function FieldRoot({ ...props }: Field.Root.Props) {
  return <Field.Root {...props} className="flex flex-col items-start gap-1" />;
}

export function FieldLabel({ ...props }: Field.Label.Props) {
  return <Field.Label {...props} className="text-sm font-medium data-invalid:text-destructive" />;
}

export function FieldError({ ...props }: Field.Error.Props) {
  return <Field.Error {...props} className="text-sm text-destructive" />;
}

'use client';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Instance = { id: string; type: string; entries: number };

function stripType(id: string, type: string): string {
  if (!id.startsWith(type)) return id;
  return id.slice(type.length).replace(/^[_-]+/, '');
}

export function InstanceFilter<T extends Instance>(props: {
  instances: T[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  const { instances, value, onChange } = props;

  return (
    <aside className="w-full md:sticky md:top-4 md:w-64 md:min-w-0 md:shrink-0 md:self-start">
      <p className="mb-3 font-medium">Select an instance</p>
      {instances.length === 0 ? (
        <p className="text-muted-foreground text-sm">No instances in this category.</p>
      ) : (
        <>
          <div className="md:hidden">
            <Select value={value ?? ''} onValueChange={onChange}>
              <SelectTrigger className="h-auto w-full py-3 data-[size=default]:h-auto">
                <SelectValue placeholder="Select an instance" />
              </SelectTrigger>
              <SelectContent>
                {instances.map((instance) => (
                  <SelectItem key={instance.id} value={instance.id}>
                    <span className="flex flex-col items-start">
                      <span className="font-medium">{instance.type}</span>
                      <span className="text-muted-foreground text-xs">
                        {stripType(instance.id, instance.type)} · {instance.entries} entries
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className="hidden max-h-125 overflow-y-auto pr-1 md:block"
            style={{
              background: `
                linear-gradient(var(--background), var(--background)) center top / 100% 16px no-repeat,
                linear-gradient(var(--background), var(--background)) center bottom / 100% 16px no-repeat,
                radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.18), transparent) center top / 100% 10px no-repeat,
                radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.18), transparent) center bottom / 100% 10px no-repeat
              `,
              backgroundAttachment: 'local, local, scroll, scroll',
            }}
          >
            <RadioGroup
              value={value ?? ''}
              onValueChange={onChange}
              className="grid-cols-1 gap-3"
            >
              {instances.map((instance) => {
                const id = `instance-${instance.id}`;
                return (
                  <FieldLabel key={instance.id} htmlFor={id}>
                    <Field orientation="horizontal">
                      <FieldContent className="min-w-0">
                        <FieldTitle className="block w-full truncate" title={instance.type}>
                          {instance.type}
                        </FieldTitle>
                        <FieldDescription className="flex min-w-0 flex-col">
                          <span className="truncate" title={stripType(instance.id, instance.type)}>
                            {stripType(instance.id, instance.type)}
                          </span>
                          <span className="mt-1 text-sm">{instance.entries} entries</span>
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={instance.id} id={id} />
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>
          </div>
        </>
      )}
    </aside>
  );
}

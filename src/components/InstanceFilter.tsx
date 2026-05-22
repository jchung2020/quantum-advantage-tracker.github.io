'use client';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
        <RadioGroup
          value={value ?? ''}
          onValueChange={onChange}
          className="max-h-125 grid-cols-1 gap-3 overflow-y-auto pr-1"
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
      )}
    </aside>
  );
}

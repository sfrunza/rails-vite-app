import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { handleApiError } from '@/lib/utils';
import { useUpdateRequestMutation } from '@/services/requests-api';
import { useAppSelector } from '@/store';

type Question = {
  id: number;
  name:
    | 'delicate_items_question_answer'
    | 'bulky_items_question_answer'
    | 'disassemble_items_question_answer';
  question: string;
};

const questions: Question[] = [
  {
    id: 1,
    name: 'delicate_items_question_answer',
    question:
      'Do you have items that easily break and need extra love (lamps, mirrors, electronics, artwork)?',
  },
  {
    id: 2,
    name: 'bulky_items_question_answer',
    question:
      'Do you have bulky items that require added handling? (e.g armoires, ellipticals, treadmills, appliances)',
  },
  {
    id: 3,
    name: 'disassemble_items_question_answer',
    question: "Do you have items that we'll need to disassemble for you?",
  },
];

const formSchema = z.object({
  delicate_items_question_answer: z.string(),
  bulky_items_question_answer: z.string(),
  disassemble_items_question_answer: z.string(),
  comments: z.string(),
});

type Inputs = z.infer<typeof formSchema>;

export default function DetailsTab() {
  const { id: requestId, details } = useAppSelector(
    (state) => state.request.request!
  );
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange',
    values: details,
    defaultValues: details,
  });

  function handleSaveChanges(values: Inputs) {
    if (!requestId) return;
    updateRequest({
      id: requestId,
      data: { details: values },
    })
      .unwrap()
      .then(() => {
        toast.success('Changes saved');
        form.reset(values);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
  return (
    <div className="p-4 bg-muted h-full dark:bg-background">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Additional details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-6">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-col justify-between gap-4 md:flex-row"
                >
                  <p className="text-sm text-muted-foreground">{q.question}</p>
                  <FormField
                    control={form.control}
                    name={q.name}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        className="flex justify-start gap-4 lg:justify-end"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id={`q${q.id}1`} />
                          <Label htmlFor={`q${q.id}1`}>Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id={`q${q.id}2`} />
                          <Label htmlFor={`q${q.id}2`}>No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              ))}

              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional details</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={8}
                        placeholder="Enter your comments..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
        <CardFooter className="justify-end border-t gap-3">
          <Button variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <LoadingButton
            disabled={isUpdating || !form.formState.isDirty}
            loading={isUpdating}
            onClick={form.handleSubmit(handleSaveChanges)}
          >
            Save changes
          </LoadingButton>
        </CardFooter>
      </Card>
    </div>
  );
}

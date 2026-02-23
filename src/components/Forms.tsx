import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, DollarSign, ShieldAlert, Package, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DivisionType, 
  DIVISIONS 
} from '@/lib/index.ts';

// --- Schemas ---

const activitySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string(),
  status: z.enum(['pending', 'completed', 'in_progress']),
  division: z.string(),
});

const financialSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(5, 'Description is required'),
  date: z.string(),
});

const violationSchema = z.object({
  santriName: z.string().min(2, 'Name is required'),
  type: z.string().min(2, 'Violation type is required'),
  severity: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'completed']),
  takzir: z.string().min(5, 'Takzir details required'),
  date: z.string(),
});

const inventorySchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  quantity: z.coerce.number().int().nonnegative(),
  condition: z.enum(['good', 'broken', 'missing']),
  status: z.enum(['available', 'borrowed']),
  borrowerName: z.string().optional(),
});

// --- Components ---

export function ActivityForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      division: 'sekretaris',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter activity title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Division</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div.id} value={div.type}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the activity details..." {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium">
          {initialData ? 'Update Activity' : 'Create Activity'}
        </Button>
      </form>
    </Form>
  );
}

export function FinancialForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const form = useForm<z.infer<typeof financialSchema>>({
    resolver: zodResolver(financialSchema),
    defaultValues: initialData || {
      type: 'income',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (IDR)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Iuran Santri, Listrik, Maintenance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Transaction details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
          <DollarSign className="mr-2 h-4 w-4" />
          Save Transaction
        </Button>
      </form>
    </Form>
  );
}

export function ViolationForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const form = useForm<z.infer<typeof violationSchema>>({
    resolver: zodResolver(violationSchema),
    defaultValues: initialData || {
      santriName: '',
      type: '',
      severity: 'low',
      status: 'pending',
      takzir: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="santriName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Santri Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter santri name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Violation Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Late for prayers, Dress code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="takzir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Takzir (Punishment)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the required takzir..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
          <ShieldAlert className="mr-2 h-4 w-4" />
          Record Violation
        </Button>
      </form>
    </Form>
  );
}

export function InventoryForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: initialData || {
      name: '',
      quantity: 1,
      condition: 'good',
      status: 'available',
      borrowerName: '',
    },
  });

  const isBorrowed = form.watch('status') === 'borrowed';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Projector, Sound System" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="borrowed">Borrowed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isBorrowed && (
          <FormField
            control={form.control}
            name="borrowerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borrower Name</FormLabel>
                <FormControl>
                  <Input placeholder="Who is borrowing this?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:opacity-90">
          <Package className="mr-2 h-4 w-4" />
          Save Item Record
        </Button>
      </form>
    </Form>
  );
}

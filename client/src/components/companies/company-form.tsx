import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCompanySchema } from "@shared/schema";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Company } from "@shared/schema";
import { z } from "zod";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY } from "@/lib/responsive-utils";

const formSchema = insertCompanySchema.extend({
  vehicleTypes: z.string().optional(),
  areasServed: z.string().optional(),
  certificationsRequired: z.string().optional(),
});

interface CompanyFormProps {
  company?: Company | null;
  onSuccess: () => void;
}

// Simplified vehicle type categories
const vehicleTypes = [
  { value: "Car", label: "Car (includes Car, Sedan, Prius, EV, Hybrid)" },
  { value: "SUV", label: "SUV (includes SUV, Luxury SUV)" },
  { value: "Van", label: "Van (includes Van, Cargo Van, Minivan, Sprinter Van, Shuttle)" },
  { value: "Truck", label: "Truck (includes Truck, Pickup Truck, Box Truck, Tractor-Trailer)" },
  { value: "Bike", label: "Bike (includes Bike, Bicycle, Scooter)" },
  { value: "Other", label: "Other (includes everything else)" }
];

export default function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company?.name || "",
      serviceVertical: company?.serviceVertical || "",
      contractType: company?.contractType || "",
      averagePay: company?.averagePay || "",
      vehicleTypes: company?.vehicleTypes?.join(", ") || "",
      areasServed: company?.areasServed?.join(", ") || "",
      insuranceRequirements: company?.insuranceRequirements || "",
      licenseRequirements: company?.licenseRequirements || "",
      certificationsRequired: company?.certificationsRequired?.join(", ") || "",
      website: company?.website || "",
      contactEmail: company?.contactEmail || "",
      contactPhone: company?.contactPhone || "",
      description: company?.description || "",
      logoUrl: company?.logoUrl || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: api.companies.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({
        title: "Success",
        description: "Company created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.companies.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      vehicleTypes: values.vehicleTypes ? values.vehicleTypes.split(",").map(s => s.trim()).filter(Boolean) : [],
      areasServed: values.areasServed ? values.areasServed.split(",").map(s => s.trim()).filter(Boolean) : [],
      certificationsRequired: values.certificationsRequired ? values.certificationsRequired.split(",").map(s => s.trim()).filter(Boolean) : [],
    };

    if (company) {
      updateMutation.mutate({ id: company.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={RESPONSIVE_GRIDS.form}>
          {/* Company Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" className={TOUCH_FRIENDLY.input} data-testid="input-company-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Vertical */}
          <FormField
            control={form.control}
            name="serviceVertical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Vertical *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={TOUCH_FRIENDLY.select} data-testid="select-service-vertical">
                      <SelectValue placeholder="Select service vertical" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Food Delivery">Food Delivery</SelectItem>
                    <SelectItem value="Package Delivery">Package Delivery</SelectItem>
                    <SelectItem value="Rideshare">Rideshare</SelectItem>
                    <SelectItem value="Freight">Freight</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Pet Transport">Pet Transport</SelectItem>
                    <SelectItem value="Child Transport">Child Transport</SelectItem>
                    <SelectItem value="Senior Services">Senior Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contract Type */}
          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={TOUCH_FRIENDLY.select} data-testid="select-contract-type">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1099">1099 Independent Contractor</SelectItem>
                    <SelectItem value="W2">W2 Employee</SelectItem>
                    <SelectItem value="Independent">Independent Contractor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Average Pay */}
          <FormField
            control={form.control}
            name="averagePay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Pay</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $15-25/hour" className={TOUCH_FRIENDLY.input} data-testid="input-average-pay" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle Types */}
          <FormField
            control={form.control}
            name="vehicleTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Types Required</FormLabel>
                <FormControl>
                  <Input placeholder="Car, SUV, Van, Truck, Bike, Other (comma separated)" className={TOUCH_FRIENDLY.input} data-testid="input-vehicle-types" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Areas Served */}
          <FormField
            control={form.control}
            name="areasServed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Areas Served</FormLabel>
                <FormControl>
                  <Input placeholder="City, State, National (comma separated)" className={TOUCH_FRIENDLY.input} data-testid="input-areas-served" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance Requirements */}
          <FormField
            control={form.control}
            name="insuranceRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Requirements</FormLabel>
                <FormControl>
                  <Input placeholder="Liability, Comprehensive, etc." className={TOUCH_FRIENDLY.input} data-testid="input-insurance-requirements" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* License Requirements */}
          <FormField
            control={form.control}
            name="licenseRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Requirements</FormLabel>
                <FormControl>
                  <Input placeholder="CDL, Regular Driver's License, etc." className={TOUCH_FRIENDLY.input} data-testid="input-license-requirements" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://company-website.com" className={TOUCH_FRIENDLY.input} data-testid="input-website" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Email */}
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@company.com" className={TOUCH_FRIENDLY.input} data-testid="input-contact-email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Phone */}
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" className={TOUCH_FRIENDLY.input} data-testid="input-contact-phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo URL */}
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://company.com/logo.png" className={TOUCH_FRIENDLY.input} data-testid="input-logo-url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Longer fields */}
        <div className="space-y-6">
          {/* Certifications Required */}
          <FormField
            control={form.control}
            name="certificationsRequired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications Required</FormLabel>
                <FormControl>
                  <Input placeholder="Food Handler, Safety Training (comma separated)" className={TOUCH_FRIENDLY.input} data-testid="input-certifications" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the company and opportunities..."
                    className={`min-h-[100px] ${TOUCH_FRIENDLY.input}`}
                    data-testid="textarea-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button 
            type="submit" 
            disabled={isLoading}
            className={`${TOUCH_FRIENDLY.button} bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300`}
            data-testid="button-submit-company-form"
          >
            {isLoading ? "Saving..." : company ? "Update Company" : "Create Company"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

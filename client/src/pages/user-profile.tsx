import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Calendar, Shield, Lock, Camera, Save, Edit3, Eye, EyeOff, Upload, Car, FileText, CheckCircle, Star, Download, Trash2, Info, X, ExternalLink, Target, GraduationCap, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User as UserType } from "@shared/schema";

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  bio?: string;
  profileImageUrl?: string;
  dotNumber?: string;
  mcNumber?: string;
}

interface ExtendedProfile {
  username?: string;
  bio?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profileImageUrl?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface CertificationInfo {
  title: string;
  description: string;
  whyNeeded: string;
  typicalEmployers: string[];
  signupLinks?: { name: string; url: string; }[];
}

const certificationInfo: Record<string, CertificationInfo> = {
  hipaa_certification: {
    title: "HIPAA Certification",
    description: "Health Insurance Portability and Accountability Act training that teaches you how to handle protected health information (PHI) properly.",
    whyNeeded: "Required for medical courier work, transporting lab specimens, medical records, or any healthcare-related deliveries. Shows you understand patient privacy laws.",
    typicalEmployers: ["Medical courier companies", "Lab specimen transport", "Healthcare facilities", "Pharmacy delivery services"],
    signupLinks: [
      { name: "HIPAA Training Center", url: "https://www.hipaatrainingcenter.com" },
      { name: "ComplianceJunction", url: "https://www.compliancejunction.com/hipaa-training" },
      { name: "AAPC HIPAA Training", url: "https://www.aapc.com/training/hipaa-compliance/" }
    ]
  },
  osha_bloodborne: {
    title: "OSHA Bloodborne Pathogens Certification",
    description: "Training on safely handling materials that may contain bloodborne pathogens like hepatitis B, hepatitis C, and HIV.",
    whyNeeded: "Essential for medical waste transport, lab specimen delivery, and any job involving potential exposure to blood or other infectious materials.",
    typicalEmployers: ["Medical waste companies", "Laboratory transport", "Healthcare facilities", "Biohazard cleanup services"],
    signupLinks: [
      { name: "OSHA Training Institute", url: "https://www.osha.gov/dte/outreach/intro_bloodborne/index.html" },
      { name: "National Safety Council", url: "https://www.nsc.org/workplace/safety-training/bloodborne-pathogens" },
      { name: "360training", url: "https://www.360training.com/osha-training/bloodborne-pathogens" }
    ]
  },
  cpr_first_aid: {
    title: "CPR/First Aid Certification",
    description: "Certification from American Red Cross or American Heart Association in cardiopulmonary resuscitation and basic first aid techniques.",
    whyNeeded: "Many gig employers prefer drivers with life-saving skills, especially for medical transport, elderly care services, and emergency delivery work.",
    typicalEmployers: ["Medical transport", "Senior care services", "Emergency courier services", "Healthcare facilities"],
    signupLinks: [
      { name: "American Red Cross", url: "https://www.redcross.org/take-a-class" },
      { name: "American Heart Association", url: "https://cpr.heart.org/en/cpr-courses-and-kits" },
      { name: "National CPR Foundation", url: "https://www.nationalcprfoundation.com" }
    ]
  },
  hazmat_certification: {
    title: "HazMat Certification",
    description: "Department of Transportation training for safely transporting hazardous materials including chemicals, medical specimens, and dangerous goods.",
    whyNeeded: "Required for transporting lab specimens, medical waste, chemicals, or any materials classified as hazardous. Opens high-paying specialized delivery opportunities.",
    typicalEmployers: ["Chemical transport companies", "Medical courier services", "Laboratory logistics", "Industrial suppliers"],
    signupLinks: [
      { name: "DOT Hazmat Training", url: "https://www.fmcsa.dot.gov/registration/hazmat/hazmat-endorsement" },
      { name: "National Truck Driving School", url: "https://www.ntds.edu/cdl-training/hazmat-endorsement/" },
      { name: "160 Driving Academy", url: "https://www.160drivingacademy.com/hazmat-endorsement/" }
    ]
  },
  iata_dot_certification: {
    title: "IATA/DOT Dangerous Goods",
    description: "International Air Transport Association and Department of Transportation certification for shipping dangerous goods by air and ground.",
    whyNeeded: "Required for transporting medical specimens, dry ice shipments, and other regulated materials. Essential for airport courier work and specialized medical transport.",
    typicalEmployers: ["Airport courier services", "Medical specimen transport", "Pharmaceutical logistics", "Air cargo companies"]
  },
  specimen_handling: {
    title: "Specimen Handling & Transport",
    description: "Specialized training in proper collection, storage, and chain of custody procedures for medical specimens and laboratory samples.",
    whyNeeded: "Essential for lab courier work and medical specimen transport. Ensures samples maintain integrity and legal chain of custody requirements.",
    typicalEmployers: ["Laboratory courier services", "Medical testing facilities", "Hospital networks", "Diagnostic companies"]
  },
  biohazard_infectious: {
    title: "Biohazard & Infectious Substance",
    description: "Advanced training for handling high-risk biological materials and infectious substances with strict safety protocols.",
    whyNeeded: "Required for transporting infectious medical waste, contaminated materials, and high-risk biological specimens. Commands premium pay rates.",
    typicalEmployers: ["Medical waste companies", "Research laboratories", "Hospital systems", "Infectious disease facilities"]
  },
  biohazard_transport_training: {
    title: "BioHazard Transport Training",
    description: "Specialized training focused on safe transport protocols, containment procedures, and regulatory compliance for biohazardous materials during transit.",
    whyNeeded: "Essential for courier services handling biohazardous materials, medical waste, and infectious specimens. Ensures compliance with DOT and EPA regulations during transport.",
    typicalEmployers: ["Medical courier services", "Biohazard transport companies", "Laboratory logistics", "Healthcare waste management"],
    signupLinks: [
      { name: "DOT Hazmat Training", url: "https://www.fmcsa.dot.gov/registration/hazmat/hazmat-endorsement" },
      { name: "OSHA Biohazard Training", url: "https://www.osha.gov/dte/library/biological_hazards/biological_hazards.html" },
      { name: "National Safety Council", url: "https://www.nsc.org/workplace/safety-training/biohazard-transport" }
    ]
  },
  medical_waste_transport: {
    title: "Medical Waste Transportation",
    description: "Specialized certification for safely collecting, transporting, and disposing of regulated medical waste materials.",
    whyNeeded: "Required by law for medical waste transport. High-demand field with excellent pay rates and steady work opportunities.",
    typicalEmployers: ["Medical waste companies", "Healthcare facilities", "Dental offices", "Veterinary clinics"]
  },
  chain_of_custody: {
    title: "Chain of Custody Certification",
    description: "Training on maintaining legal documentation and security protocols when transporting evidence, specimens, or sensitive materials.",
    whyNeeded: "Essential for legal courier work, drug testing transport, and forensic specimen delivery. Ensures legal admissibility of transported materials.",
    typicalEmployers: ["Legal courier services", "Drug testing companies", "Law enforcement agencies", "Forensic laboratories"]
  },
  dangerous_goods_dg: {
    title: "Dangerous Goods (DG) Certified",
    description: "General certification for handling and transporting various classes of dangerous goods including chemicals, medical materials, and hazardous substances.",
    whyNeeded: "Broadens your eligibility for specialized transport work with higher pay rates. Many logistics companies require this certification.",
    typicalEmployers: ["Logistics companies", "Chemical transport", "Medical courier services", "Industrial suppliers"]
  },
  dangerous_goods_dg7: {
    title: "Dangerous Goods Class 7 (DG7) Certified",
    description: "Specialized certification for handling and transporting radioactive materials used in medical imaging, cancer treatment, and research.",
    whyNeeded: "Highly specialized certification for transporting radioactive medical materials. Commands premium rates due to specialized knowledge required.",
    typicalEmployers: ["Medical imaging centers", "Cancer treatment facilities", "Research laboratories", "Nuclear medicine departments"]
  },
  defensive_driving: {
    title: "Defensive Driving Certification",
    description: "Professional driving course focusing on accident prevention, safety techniques, and liability reduction strategies.",
    whyNeeded: "Reduces insurance costs and demonstrates professional driving commitment. Many employers prefer or require certified defensive drivers.",
    typicalEmployers: ["All delivery companies", "Rideshare services", "Medical transport", "Corporate fleet services"],
    signupLinks: [
      { name: "National Safety Council", url: "https://www.nsc.org/workplace/safety-training/defensive-driving" },
      { name: "AAA Driving School", url: "https://drivingtests.aaa.com/defensive-driving/" },
      { name: "I Drive Safely", url: "https://www.idrivesafely.com/defensive-driving/" }
    ]
  },
  osha_general_industry: {
    title: "OSHA General Industry Training",
    description: "10-hour or 30-hour workplace safety training covering general industry safety standards and hazard recognition.",
    whyNeeded: "Demonstrates safety awareness and reduces employer liability. Preferred for warehouse, industrial, and healthcare facility work.",
    typicalEmployers: ["Warehouse operations", "Manufacturing facilities", "Healthcare centers", "Industrial contractors"]
  },
  osha_fire_safety: {
    title: "OSHA Workplace Fire Safety Training",
    description: "Comprehensive training on fire prevention, emergency response procedures, and proper use of fire suppression equipment in workplace environments.",
    whyNeeded: "Essential for medical couriers working in healthcare facilities, laboratories, and medical buildings. Demonstrates safety competency and reduces liability for employers.",
    typicalEmployers: ["Medical courier services", "Healthcare facilities", "Laboratory transport companies", "Hospital networks"],
    signupLinks: [
      { name: "OSHA Training Institute", url: "https://www.osha.gov/education/outreach" },
      { name: "National Safety Council", url: "https://www.nsc.org/workplace/safety-training/fire-safety" },
      { name: "Red Cross Fire Safety Training", url: "https://www.redcross.org/take-a-class/workplace-safety" }
    ]
  },
  osha_hazcom: {
    title: "OSHA Hazard Communication (Haz-Com) Training",
    description: "Training on chemical hazard communication, safety data sheets (SDS), and proper handling of hazardous substances for medical couriers.",
    whyNeeded: "Required for medical couriers handling laboratory chemicals, medical specimens, and hazardous materials. Ensures compliance with OSHA's Hazard Communication Standard.",
    typicalEmployers: ["Medical courier companies", "Laboratory transport services", "Chemical transport companies", "Research facility couriers"],
    signupLinks: [
      { name: "OSHA Training Institute", url: "https://www.osha.gov/dte/outreach/hazcom/index.html" },
      { name: "National Safety Council", url: "https://www.nsc.org/workplace/safety-training/hazard-communication" },
      { name: "360training OSHA HazCom", url: "https://www.360training.com/osha-training/hazard-communication" }
    ]
  },
  cold_chain_management: {
    title: "Cold Chain Management",
    description: "Specialized training for maintaining temperature-controlled environments during transport of pharmaceuticals, vaccines, and temperature-sensitive medical supplies.",
    whyNeeded: "Essential for pharmaceutical delivery and medical supply transport. Growing field with excellent pay due to specialized requirements.",
    typicalEmployers: ["Pharmaceutical companies", "Medical supply companies", "Vaccine distribution", "Specialty pharmacies"],
    signupLinks: [
      { name: "Cold Chain Institute", url: "https://www.coldchaininstitute.org" },
      { name: "IACET Cold Chain Training", url: "https://www.iacet.org/cold-chain-management/" },
      { name: "BioPharma Dive Training", url: "https://www.biopharmadive.com/cold-chain-training/" }
    ]
  },
  tsa_certification: {
    title: "TSA Certification",
    description: "Transportation Security Administration certification for accessing secure areas of airports and handling regulated cargo.",
    whyNeeded: "Required for airport courier work and cargo handling. Provides access to high-paying airport delivery opportunities with major logistics companies.",
    typicalEmployers: ["Airport courier services", "Cargo airlines", "Express delivery companies", "Airport logistics"],
    signupLinks: [
      { name: "TSA.gov - TWIC Application", url: "https://www.tsa.gov/for-industry/twic" },
      { name: "Universal Enrollment Services", url: "https://universalenroll.dhs.gov" },
      { name: "HME/TWIC Processing", url: "https://www.hmetwicdocs.com" }
    ]
  },
  twic_certification: {
    title: "TWIC® (Transportation Worker Identification Credential)",
    description: "Transportation Security Administration security credential for workers who need access to secure areas of maritime facilities and vessels. Requires background check and biometric enrollment.",
    whyNeeded: "Required by Maritime Transportation Security Act for accessing secure port areas, maritime facilities, and vessels. Opens high-paying opportunities in port logistics, cargo handling, and maritime transport with major shipping companies.",
    typicalEmployers: ["Port logistics companies", "Maritime shipping facilities", "Cargo handling operations", "Freight forwarding companies", "Coast Guard licensed operations", "Container shipping services"],
    signupLinks: [
      { name: "TSA TWIC® Application", url: "https://www.tsa.gov/twic" },
      { name: "TWIC® Enrollment Centers", url: "https://tsaenrollmentbyidemia.tsa.dhs.gov/locator?serviceCode=111111&programs=twic" },
      { name: "TWIC® Online Application", url: "https://tsaenrollmentbyidemia.tsa.dhs.gov/workflows?servicecode=111111&service=pre-enroll&showBack=true" }
    ]
  },
  dot_number: {
    title: "DOT Number",
    description: "Department of Transportation identification number assigned to commercial vehicle operators for safety monitoring and compliance tracking.",
    whyNeeded: "Required for interstate commerce and certain intrastate operations. Essential for fleet management, regulatory compliance, and working with major logistics companies that require DOT verification.",
    typicalEmployers: ["Commercial trucking companies", "Freight brokers", "Logistics companies requiring DOT compliance", "Fleet management services"]
  },
  mc_number: {
    title: "MC Number (Motor Carrier Authority)",
    description: "Federal Motor Carrier Safety Administration authority number that grants permission to operate as a for-hire carrier in interstate commerce.",
    whyNeeded: "Required to legally transport goods or passengers for compensation across state lines. Opens opportunities with major shipping companies and allows you to operate as an independent contractor.",
    typicalEmployers: ["Interstate shipping companies", "Cross-border logistics firms", "National courier services", "Independent contractor platforms"]
  },
  custom_cert_1: {
    title: "Custom Certification 1",
    description: "User-customizable certification field for any specialized training, license, or credential not covered in standard categories.",
    whyNeeded: "Allows you to showcase unique qualifications that set you apart from other drivers. Many specialized courier jobs require niche certifications not covered by standard categories.",
    typicalEmployers: ["Specialized courier services", "Industry-specific transport companies", "Niche delivery services", "Companies with unique requirements"]
  },
  custom_cert_2: {
    title: "Custom Certification 2",
    description: "Additional user-customizable certification field for specialized training, industry credentials, or unique qualifications.",
    whyNeeded: "Provides flexibility to document all relevant credentials that might be valuable for specific gig opportunities or specialized transport services.",
    typicalEmployers: ["Specialty transport companies", "Industry-specific couriers", "Companies with unique credential requirements", "Specialized delivery platforms"]
  },
  phlebotomy_tech: {
    title: "Phlebotomy Technician Certification",
    description: "Professional certification for drawing blood samples and handling specimens for laboratory testing and medical procedures.",
    whyNeeded: "Essential for medical courier work involving specimen transport. Opens high-paying opportunities with hospitals, labs, and medical facilities that require trained personnel for blood sample handling.",
    typicalEmployers: ["Medical laboratories", "Hospitals and clinics", "Blood banks", "Diagnostic centers", "Mobile phlebotomy services"],
    signupLinks: [
      { name: "National Phlebotomy Association", url: "https://www.nationalphlebotomy.org" },
      { name: "American Society for Clinical Pathology", url: "https://www.ascp.org/content/board-of-certification" },
      { name: "Phlebotomy Career Training", url: "https://www.phlebotomycareertraining.com" }
    ]
  },
  customer_service_training: {
    title: "Customer Service Training Certification",
    description: "Professional training in customer interaction, communication skills, and service excellence for medical and healthcare environments.",
    whyNeeded: "Valuable for patient-facing delivery roles and medical courier positions. Demonstrates professionalism and communication skills that medical facilities highly value.",
    typicalEmployers: ["Patient transport services", "Medical courier companies", "Healthcare delivery services", "Pharmacy delivery platforms"],
    signupLinks: [
      { name: "Customer Service Institute", url: "https://www.customerserviceinstitute.com" },
      { name: "ICMI Customer Service Training", url: "https://www.icmi.com/training" },
      { name: "Dale Carnegie Training", url: "https://www.dalecarnegie.com/en/courses/customer-service-training" }
    ]
  }
};

// Helper component for certification info button
const CertificationInfoButton = ({ certKey }: { certKey: string }) => {
  const cert = certificationInfo[certKey];
  if (!cert) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {cert.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What is this certification?</h4>
            <p className="text-sm text-gray-600">{cert.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Why might you need it?</h4>
            <p className="text-sm text-gray-600">{cert.whyNeeded}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Common employers requiring this:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {cert.typicalEmployers.map((employer, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {employer}
                </li>
              ))}
            </ul>
          </div>
          {cert.signupLinks && cert.signupLinks.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Get certified online:</h4>
              <div className="space-y-2">
                {cert.signupLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-blue-700">{link.name}</span>
                    <ExternalLink className="h-4 w-4 text-blue-600 group-hover:text-blue-800" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Questionnaire state
  const [questionnaire, setQuestionnaire] = useState({
    primaryGoal: '',
    incomeTarget: '',
    schedulePreferences: [] as string[],
    industryInterests: [] as string[],
    vehicleTypes: [] as string[],
    distancePreference: ''
  });


  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGovId, setUploadingGovId] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [uploadingHipaa, setUploadingHipaa] = useState(false);
  const [uploadingTsaCert, setUploadingTsaCert] = useState(false);
  const [uploadingMedCert, setUploadingMedCert] = useState<string | null>(null);
  const [uploadingAutoInsurance, setUploadingAutoInsurance] = useState(false);
  const [uploadingCommercialAuto, setUploadingCommercialAuto] = useState(false);
  const [uploadingDotNumber, setUploadingDotNumber] = useState(false);
  const [uploadingMcNumber, setUploadingMcNumber] = useState(false);
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [hipaaFile, setHipaaFile] = useState<File | null>(null);
  const [tsaCertFile, setTsaCertFile] = useState<File | null>(null);
  const [autoInsuranceFile, setAutoInsuranceFile] = useState<File | null>(null);
  const [commercialAutoFile, setCommercialAutoFile] = useState<File | null>(null);
  const [dotNumberFile, setDotNumberFile] = useState<File | null>(null);
  const [mcNumberFile, setMcNumberFile] = useState<File | null>(null);
  const [customCert1Name, setCustomCert1Name] = useState<string>('Custom Certification 1');
  const [customCert2Name, setCustomCert2Name] = useState<string>('Custom Certification 2');
  const [editingCustom1, setEditingCustom1] = useState<boolean>(false);
  const [editingCustom2, setEditingCustom2] = useState<boolean>(false);
  
  // Debounce ref for auto-save
  const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const currentUser = user as UserType;

  // Helper function to get display name for document types
  const getDocumentDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      government_id: 'Government ID',
      drivers_license: 'Driver\'s License',
      tsa_certification: 'TSA Certification',
      hipaa_certification: 'HIPAA Certification',
      osha_bloodborne: 'OSHA Bloodborne Pathogen',
      cpr_first_aid: 'CPR & First Aid',
      hazmat_certification: 'HazMat Certification',
      iata_dot_certification: 'IATA/DOT Certification',
      specimen_handling: 'Specimen Handling',
      biohazard_infectious: 'Biohazard & Infectious Disease',
      medical_waste_transport: 'Medical Waste Transport',
      chain_of_custody: 'Chain of Custody',
      defensive_driving: 'Defensive Driving',
      osha_general_industry: 'OSHA General Industry',
      cold_chain_management: 'Cold Chain Management',
      phlebotomy_technician: 'Phlebotomy Technician',
      customer_service_training: 'Customer Service Training',
      custom_cert_1: customCert1Name,
      custom_cert_2: customCert2Name,
      insurance: 'Insurance Document',
      registration: 'Vehicle Registration',
      inspection: 'Vehicle Inspection',
      business_license: 'Business License',
      tax_document: 'Tax Document',
      contract: 'Contract',
      receipt: 'Receipt',
      other: 'Other Document'
    };
    return displayNames[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Fetch extended profile data
  const { data: extendedProfile, isLoading } = useQuery<ExtendedProfile>({
    queryKey: ["/api/user/profile"],
    refetchInterval: 30000,
  });

  // Fetch user documents to show upload status
  const { data: userDocuments } = useQuery({
    queryKey: ["/api/documents"],
    refetchInterval: 30000,
  });

  // Fetch user vehicles
  const { data: userVehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    refetchInterval: 30000,
  });


  // Fetch user applications 
  const { data: userApplications } = useQuery({
    queryKey: ["/api/applications"],
    refetchInterval: 30000,
  });

  // Fetch user business entities
  const { data: businessEntities } = useQuery({
    queryKey: ["/api/business-entities"],
    refetchInterval: 30000,
  });

  // Fetch user expenses
  const { data: userExpenses } = useQuery({
    queryKey: ["/api/expenses"],
    refetchInterval: 30000,
  });

  // Initialize profile data from current user and extended profile
  useEffect(() => {
    if (currentUser || extendedProfile) {
      setProfileData({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || '',
        username: currentUser?.username || '',
        phone: currentUser?.phone || extendedProfile?.phone || '',
        address: currentUser?.address || extendedProfile?.address || '',
        city: currentUser?.city || extendedProfile?.city || '',
        state: currentUser?.state || extendedProfile?.state || '',
        zipCode: currentUser?.zipCode || extendedProfile?.zipCode || '',
        dateOfBirth: currentUser?.dateOfBirth || extendedProfile?.dateOfBirth || '',
        bio: currentUser?.bio || extendedProfile?.bio || '',
        profileImageUrl: currentUser?.profileImageUrl || extendedProfile?.profileImageUrl || '',
        dotNumber: currentUser?.dotNumber || '',
        mcNumber: currentUser?.mcNumber || '',
      });
    }
  }, [currentUser, extendedProfile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordData) => {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  // Simple auto-save function
  const autoSaveProfile = useCallback((field: string, value: string) => {
    if (debounceRef.current[field]) {
      clearTimeout(debounceRef.current[field]);
    }
    
    debounceRef.current[field] = setTimeout(() => {
      const updatedData = { [field]: value };
      updateProfileMutation.mutate(updatedData);
    }, 1000);
  }, [updateProfileMutation]);

  // Save questionnaire responses
  const handleSaveQuestionnaire = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          gigGoals: JSON.stringify(questionnaire)
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your goals and preferences have been saved successfully!",
        });
        // Refresh user data
        queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      } else {
        toast({
          title: "Error",
          description: "Failed to save preferences. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    const updatedQuestionnaire = {
      ...questionnaire,
      [name]: value
    };
    setQuestionnaire(updatedQuestionnaire);
    
    // Auto-save after a short delay
    setTimeout(() => {
      autoSaveQuestionnaire(updatedQuestionnaire);
    }, 500);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, value: string) => {
    const currentArray = questionnaire[name as keyof typeof questionnaire] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    const updatedQuestionnaire = {
      ...questionnaire,
      [name]: updatedArray
    };
    setQuestionnaire(updatedQuestionnaire);
    
    // Auto-save after a short delay
    setTimeout(() => {
      autoSaveQuestionnaire(updatedQuestionnaire);
    }, 500);
  };

  // Auto-save questionnaire function
  const autoSaveQuestionnaire = async (questionnaireData: typeof questionnaire) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          gigGoals: JSON.stringify(questionnaireData)
        })
      });

      if (response.ok) {
        // Optional: Show a subtle success indicator
        console.log('Questionnaire auto-saved successfully');
      }
    } catch (error) {
      console.error('Error auto-saving questionnaire:', error);
    }
  };


  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate(passwordData);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Error",
        description: "Image size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await fetch('/api/user/profile-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const result = await response.json();
      
      // Update profile data with new image URL
      setProfileData(prev => ({ ...prev, profileImageUrl: result.profileImageUrl }));
      
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been successfully updated.",
      });

      // Refresh profile data
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle government ID upload
  const handleGovIdUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingGovId(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'government_id');

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setGovIdFile(file);
      
      toast({
        title: "Document Uploaded",
        description: "Your government ID has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingGovId(false);
    }
  };

  // Handle driver's license upload
  const handleLicenseUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingLicense(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'drivers_license');

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setLicenseFile(file);
      
      // Refresh documents data
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      
      toast({
        title: "Document Uploaded",
        description: "Your driver's license has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingLicense(false);
    }
  };

  // Handle HIPAA certification upload
  const handleHipaaUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingHipaa(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'hipaa_certification');

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setHipaaFile(file);
      
      toast({
        title: "Document Uploaded",
        description: "Your HIPAA certification has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingHipaa(false);
    }
  };

  // Helper function to check if a document type is uploaded
  const isDocumentUploaded = (docType: string) => {
    return Array.isArray(userDocuments) && userDocuments.some((doc: any) => doc.type === docType);
  };

  // Helper function to get document for a specific type
  const getDocumentByType = (docType: string) => {
    return Array.isArray(userDocuments) ? userDocuments.find((doc: any) => doc.type === docType) : undefined;
  };

  // Handle document view/download
  const handleViewDocument = (docType: string) => {
    const document = getDocumentByType(docType);
    if (document) {
      window.open(`/api/documents/${document.id}/view`, '_blank');
    }
  };

  // Handle document download
  const handleDownloadDocument = (docType: string) => {
    const document = getDocumentByType(docType);
    if (document) {
      window.open(`/api/documents/${document.id}/download`, '_blank');
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (docType: string) => {
    const document = getDocumentByType(docType);
    if (!document) return;

    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Refresh documents data
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTsaCertUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingTsaCert(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'tsa_certification');

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setTsaCertFile(file);
      
      toast({
        title: "Document Uploaded",
        description: "Your TSA certification has been uploaded successfully.",
      });
      
      // Invalidate documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingTsaCert(false);
    }
  };

  // Handle DOT Number document upload
  const handleDotNumberUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingDotNumber(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'dot_number_document');

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Refresh documents to update the UI
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      toast({
        title: "Document Uploaded",
        description: "Your DOT certificate has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading DOT document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDotNumber(false);
    }
  };

  // Handle MC Number document upload
  const handleMcNumberUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingMcNumber(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'mc_number_document');

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Refresh documents to update the UI
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      toast({
        title: "Document Uploaded",
        description: "Your MC certificate has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading MC document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingMcNumber(false);
    }
  };

  // Handle medical certification upload
  const handleMedicalCertUpload = async (file: File, certType: string, displayName: string) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingMedCert(certType);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', certType);

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "Certification Uploaded",
        description: `Your ${displayName} has been uploaded successfully.`,
      });

      // Refresh documents to update UI
      await queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload certification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingMedCert(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in to access your profile</h2>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const profile: ExtendedProfile = extendedProfile || {
    username: '',
    bio: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImageUrl: ''
  };

  // Load questionnaire data from profile when profile loads
  useEffect(() => {
    if (profile?.gigGoals) {
      try {
        const savedQuestionnaire = JSON.parse(profile.gigGoals);
        setQuestionnaire({
          primaryGoal: savedQuestionnaire.primaryGoal || '',
          incomeTarget: savedQuestionnaire.incomeTarget || '',
          schedulePreferences: savedQuestionnaire.schedulePreferences || [],
          industryInterests: savedQuestionnaire.industryInterests || [],
          vehicleTypes: savedQuestionnaire.vehicleTypes || [],
          distancePreference: savedQuestionnaire.distancePreference || ''
        });
      } catch (error) {
        console.error('Error parsing saved questionnaire data:', error);
      }
    }
  }, [profile?.gigGoals]);

  const displayName = currentUser?.firstName && currentUser?.lastName 
    ? `${currentUser.firstName} ${currentUser.lastName}` 
    : currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={profileData.profileImageUrl || currentUser?.profileImageUrl || profile.profileImageUrl} 
                  alt={displayName} 
                />
                <AvatarFallback className="text-lg">
                  {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="profile-photo-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('profile-photo-upload')?.click()}
                    disabled={uploadingPhoto}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {uploadingPhoto ? "Uploading..." : "Change Photo"}
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="overviewFirstName">First Name</Label>
                    <Input
                      id="overviewFirstName"
                      value={profileData.firstName ?? currentUser?.firstName ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, firstName: value }));
                        autoSaveProfile('firstName', value);
                      }}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overviewLastName">Last Name</Label>
                    <Input
                      id="overviewLastName"
                      value={profileData.lastName ?? currentUser?.lastName ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, lastName: value }));
                        autoSaveProfile('lastName', value);
                      }}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overviewEmail">Email</Label>
                    <Input
                      id="overviewEmail"
                      type="email"
                      value={profileData.email ?? currentUser?.email ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, email: value }));
                        autoSaveProfile('email', value);
                      }}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overviewUsername">Username</Label>
                    <Input
                      id="overviewUsername"
                      value={profileData.username ?? profile.username ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, username: value }));
                        autoSaveProfile('username', value);
                      }}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Profile Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <p className="text-lg font-semibold">{displayName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-lg">{currentUser?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Username</Label>
                    <p className="text-lg">{profile.username || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Account Type</Label>
                    <div className="flex items-center gap-2">
                      {currentUser?.isAdmin ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Administrator
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          Lifetime User
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Profile Data Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        


      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="personal" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1">
          <TabsTrigger value="personal" style={{color: '#1f2937', fontWeight: '600'}} className="font-semibold text-xs md:text-sm px-2 py-3 text-center whitespace-nowrap overflow-hidden">Personal Info</TabsTrigger>
          <TabsTrigger value="verification" style={{color: '#1f2937', fontWeight: '600'}} className="font-semibold text-xs md:text-sm px-2 py-3 text-center whitespace-nowrap overflow-hidden">License & Certs</TabsTrigger>
          <TabsTrigger value="medical" style={{color: '#1f2937', fontWeight: '600'}} className="font-semibold text-xs md:text-sm px-2 py-3 text-center whitespace-nowrap overflow-hidden">Medical Certs</TabsTrigger>
          <TabsTrigger value="contact" style={{color: '#1f2937', fontWeight: '600'}} className="font-semibold text-xs md:text-sm px-2 py-3 text-center whitespace-nowrap overflow-hidden">Contact</TabsTrigger>
          <TabsTrigger value="security" style={{color: '#1f2937', fontWeight: '600'}} className="font-semibold text-xs md:text-sm px-2 py-3 text-center whitespace-nowrap overflow-hidden">Security</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel Edit" : "Edit Information"}
                  </Button>
                  {isEditing && (
                    <Button 
                      onClick={() => {
                        // Save all current form data
                        Object.entries(profileData).forEach(([key, value]) => {
                          if (value !== undefined && value !== null && value !== '') {
                            autoSaveProfile(key as keyof ProfileData, value);
                          }
                        });
                        toast({
                          title: "Changes Saved",
                          description: "Your profile information has been saved successfully.",
                        });
                      }}
                      variant="default"
                      size="sm"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={isEditing ? (profileData.firstName ?? currentUser?.firstName ?? '') : (currentUser?.firstName ?? '')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfileData(prev => ({ ...prev, firstName: value }));
                        }}
                        onBlur={(e) => {
                          if (isEditing) autoSaveProfile('firstName', e.target.value);
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={isEditing ? (profileData.lastName ?? currentUser?.lastName ?? '') : (currentUser?.lastName ?? '')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfileData(prev => ({ ...prev, lastName: value }));
                        }}
                        onBlur={(e) => {
                          if (isEditing) autoSaveProfile('lastName', e.target.value);
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={isEditing ? (profileData.username ?? profile.username ?? '') : (profile.username ?? '')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfileData(prev => ({ ...prev, username: value }));
                        }}
                        onBlur={(e) => {
                          if (isEditing) autoSaveProfile('username', e.target.value);
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={isEditing ? (profileData.dateOfBirth ?? profile.dateOfBirth ?? '') : (profile.dateOfBirth ?? '')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfileData(prev => ({ ...prev, dateOfBirth: value }));
                        }}
                        onBlur={(e) => {
                          if (isEditing) autoSaveProfile('dateOfBirth', e.target.value);
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  {/* Goals & Objectives Questionnaire */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-600" />
                        Goals & Objectives Questionnaire
                      </h3>
                      <p className="text-sm text-gray-600">Help us understand your goals and preferences to provide personalized recommendations.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Question 1: Primary Goal */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">What's your primary goal with gig work?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="primary-goal" 
                              value="full-time-income" 
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('primaryGoal', e.target.value)}
                              checked={questionnaire.primaryGoal === 'full-time-income'}
                            />
                            <span className="text-sm">Full-time income replacement</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="primary-goal" 
                              value="part-time-income" 
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('primaryGoal', e.target.value)}
                              checked={questionnaire.primaryGoal === 'part-time-income'}
                            />
                            <span className="text-sm">Part-time supplemental income</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="primary-goal" 
                              value="flexible-schedule" 
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('primaryGoal', e.target.value)}
                              checked={questionnaire.primaryGoal === 'flexible-schedule'}
                            />
                            <span className="text-sm">Flexible schedule control</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="primary-goal" 
                              value="experience-industries" 
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('primaryGoal', e.target.value)}
                              checked={questionnaire.primaryGoal === 'experience-industries'}
                            />
                            <span className="text-sm">Experience different industries</span>
                          </label>
                        </div>
                      </div>

                      {/* Question 2: Income Target */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">What's your target monthly income from gig work?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="income-target" 
                              value="500-1500"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('incomeTarget', e.target.value)}
                              checked={questionnaire.incomeTarget === '500-1500'}
                            />
                            <span className="text-sm">$500 - $1,500/month</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="income-target" 
                              value="1500-3000"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('incomeTarget', e.target.value)}
                              checked={questionnaire.incomeTarget === '1500-3000'}
                            />
                            <span className="text-sm">$1,500 - $3,000/month</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="income-target" 
                              value="3000-5000"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('incomeTarget', e.target.value)}
                              checked={questionnaire.incomeTarget === '3000-5000'}
                            />
                            <span className="text-sm">$3,000 - $5,000/month</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="income-target" 
                              value="5000-plus"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('incomeTarget', e.target.value)}
                              checked={questionnaire.incomeTarget === '5000-plus'}
                            />
                            <span className="text-sm">$5,000+/month</span>
                          </label>
                        </div>
                      </div>

                      {/* Question 3: Industry Preferences */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Which industries interest you most?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600" 
                              value="food"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('food')}
                            />
                            <span className="text-sm">🍔 Food</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="package-delivery"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('package-delivery')}
                            />
                            <span className="text-sm">📦 Package Delivery</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="rideshare"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('rideshare')}
                            />
                            <span className="text-sm">🚗 Rideshare</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="freight"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('freight')}
                            />
                            <span className="text-sm">🚛 Freight</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="medical"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('medical')}
                            />
                            <span className="text-sm">🏥 Medical</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="cannabis-delivery"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('cannabis-delivery')}
                            />
                            <span className="text-sm">🌿 Cannabis Delivery</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="pet-transport"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('pet-transport')}
                            />
                            <span className="text-sm">🐕 Pet Transport</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="child-transport"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('child-transport')}
                            />
                            <span className="text-sm">👶 Child Transport</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="senior-services"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('senior-services')}
                            />
                            <span className="text-sm">👴 Senior Services</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="air-transport"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('air-transport')}
                            />
                            <span className="text-sm">✈️ Air Transport</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="vehicle-transport"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('vehicle-transport')}
                            />
                            <span className="text-sm">🚙 Vehicle Transport</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="luggage-delivery"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('luggage-delivery')}
                            />
                            <span className="text-sm">🧳 Luggage Delivery</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="other"
                              onChange={(e) => handleCheckboxChange('industryInterests', e.target.value)}
                              checked={questionnaire.industryInterests.includes('other')}
                            />
                            <span className="text-sm">🔧 Other</span>
                          </label>
                        </div>
                      </div>

                      {/* Question 4: Vehicle Types */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">What vehicle types do you have available for gig work?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600" 
                              value="car"
                              onChange={(e) => handleCheckboxChange('vehicleTypes', e.target.value)}
                              checked={questionnaire.vehicleTypes?.includes('car') || false}
                            />
                            <span className="text-sm">🚗 Car (includes Car, Sedan, Prius, EV, Hybrid)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="suv"
                              onChange={(e) => handleCheckboxChange('vehicleTypes', e.target.value)}
                              checked={questionnaire.vehicleTypes?.includes('suv') || false}
                            />
                            <span className="text-sm">🚙 SUV (includes SUV, Luxury SUV)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="van"
                              onChange={(e) => handleCheckboxChange('vehicleTypes', e.target.value)}
                              checked={questionnaire.vehicleTypes?.includes('van') || false}
                            />
                            <span className="text-sm">🚐 Van (includes Van, Cargo Van, Minivan, Sprinter Van, Shuttle)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="truck"
                              onChange={(e) => handleCheckboxChange('vehicleTypes', e.target.value)}
                              checked={questionnaire.vehicleTypes?.includes('truck') || false}
                            />
                            <span className="text-sm">🚛 Truck (includes Truck, Pickup Truck, Box Truck, Tractor-Trailer)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="bike"
                              onChange={(e) => handleCheckboxChange('vehicleTypes', e.target.value)}
                              checked={questionnaire.vehicleTypes?.includes('bike') || false}
                            />
                            <span className="text-sm">🚲 Bike (includes Bike, Bicycle, Scooter)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="text-blue-600"
                              value="other-vehicle"
                              onChange={(e) => handleCheckboxChange('vehicleTypes', e.target.value)}
                              checked={questionnaire.vehicleTypes?.includes('other-vehicle') || false}
                            />
                            <span className="text-sm">🛻 Other (includes everything else)</span>
                          </label>
                        </div>
                      </div>

                      {/* Question 5: Distance Preference */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">How far are you willing to travel for gig work?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="distance-preference" 
                              value="local-only"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('distancePreference', e.target.value)}
                              checked={questionnaire.distancePreference === 'local-only'}
                            />
                            <span className="text-sm">Local only (within 15 miles)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="distance-preference" 
                              value="regional"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('distancePreference', e.target.value)}
                              checked={questionnaire.distancePreference === 'regional'}
                            />
                            <span className="text-sm">Regional (15-50 miles)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="distance-preference" 
                              value="long-distance"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('distancePreference', e.target.value)}
                              checked={questionnaire.distancePreference === 'long-distance'}
                            />
                            <span className="text-sm">Long distance (50+ miles)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="distance-preference" 
                              value="flexible"
                              className="text-blue-600" 
                              onChange={(e) => handleRadioChange('distancePreference', e.target.value)}
                              checked={questionnaire.distancePreference === 'flexible'}
                            />
                            <span className="text-sm">Flexible/Variable distance</span>
                          </label>
                        </div>
                      </div>


                      {/* Additional Information - Editable */}
                      <div className="mt-4 bg-white p-4 rounded-lg border-l-4 border-blue-500">
                        <h5 className="font-medium text-gray-900 mb-2">Additional Information</h5>
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-900 leading-relaxed">
                            <strong>Help Your AI Assistant Help You:</strong> Please share detailed information about your interests in independent driving. Include things like your goals (earn extra income, full-time career, fleet expansion), preferred service types (medical, food delivery, package delivery, etc.), any special skills or certifications you have, geographic preferences, scheduling flexibility, vehicle capabilities, and what success looks like to you. The more specific you are, the better GigBot AI can provide personalized recommendations, identify ideal companies for your situation, and guide you toward achieving your gig economy goals.
                          </p>
                        </div>
                        <Textarea
                          placeholder="Example: I'm interested in building a full-time medical courier business. I have HIPAA training and CPR certification. I prefer local routes (under 50 miles) with flexible hours. My goal is to earn $60k+ annually and eventually hire 2-3 drivers. I have a reliable SUV with temperature-controlled storage. I want to focus on medical specimen transport and pharmaceutical delivery..."
                          value={profileData.bio ?? profile.bio ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProfileData(prev => ({ ...prev, bio: value }));
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            autoSaveProfile('bio', value);
                          }}
                          rows={6}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Documents Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>License and Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">


                {/* Driver & Vehicle Credentials */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Car className="w-4 h-4 mr-2 text-blue-600" />
                    Driver & Vehicle Credentials
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Driver's License</p>
                          <p className="text-xs text-gray-500 mt-1">Must be valid & meet state requirements</p>
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('license') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('license') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="license-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLicenseUpload(file);
                          }}
                        />
                        {isDocumentUploaded('license') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('license')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('license')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('license')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('license-input')?.click()}
                            disabled={uploadingLicense}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingLicense ? 'Uploading...' : 'Upload License'}
                          </Button>
                        )}
                      </div>
                    </div>
                    {/* Regular Auto Insurance */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Regular Auto Insurance</p>
                            <p className="text-xs text-gray-500 mt-1">Current vehicle insurance certificate</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('auto_insurance') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('auto_insurance') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="auto-insurance-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'auto_insurance', 'Auto Insurance');
                          }}
                        />
                        {isDocumentUploaded('auto_insurance') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('auto_insurance')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('auto_insurance')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('auto_insurance')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('auto-insurance-input')?.click()}
                            disabled={uploadingMedCert === 'auto_insurance'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'auto_insurance' ? 'Uploading...' : 'Upload Insurance'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Commercial Auto Insurance */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Commercial Auto Insurance</p>
                            <p className="text-xs text-gray-500 mt-1">Commercial vehicle insurance certificate</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('commercial_auto_insurance') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('commercial_auto_insurance') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="commercial-auto-insurance-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'commercial_auto_insurance', 'Commercial Auto Insurance');
                          }}
                        />
                        {isDocumentUploaded('commercial_auto_insurance') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('commercial_auto_insurance')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('commercial_auto_insurance')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('commercial_auto_insurance')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('commercial-auto-insurance-input')?.click()}
                            disabled={uploadingMedCert === 'commercial_auto_insurance'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'commercial_auto_insurance' ? 'Uploading...' : 'Upload Commercial Insurance'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* TSA Certification (moved down one position) */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">TSA Certification</p>
                            <p className="text-xs text-gray-500 mt-1">Transportation Security Administration certification</p>
                          </div>
                          <CertificationInfoButton certKey="tsa_certification" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('tsa_certification') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('tsa_certification') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {isDocumentUploaded('tsa_certification') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('tsa_certification')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('tsa_certification')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('tsa_certification')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600 mb-2">Required for secure transportation work</p>
                              <input
                                id="tsa-cert-input"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleTsaCertUpload(file);
                                }}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => document.getElementById('tsa-cert-input')?.click()}
                              disabled={uploadingTsaCert}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              {uploadingTsaCert ? 'Uploading...' : 'Upload TSA Certification'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* TWIC Certification */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">TWIC® Certification</p>
                            <p className="text-xs text-gray-500 mt-1">Transportation Worker Identification Credential for maritime facilities</p>
                          </div>
                          <CertificationInfoButton certKey="twic_certification" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('twic_certification') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('twic_certification') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="twic-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'twic_certification', 'TWIC® Certification');
                          }}
                        />
                        {isDocumentUploaded('twic_certification') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('twic_certification')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('twic_certification')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('twic_certification')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600 mb-2">Required for maritime facility and vessel access</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => document.getElementById('twic-cert-input')?.click()}
                              disabled={uploadingMedCert === 'twic_certification'}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              {uploadingMedCert === 'twic_certification' ? 'Uploading...' : 'Upload TWIC® Certification'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* DOT & MC Numbers */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-purple-600" />
                    DOT & MC Numbers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* DOT Number Card */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">DOT Number</p>
                            <p className="text-xs text-gray-500 mt-1">Safety monitoring ID</p>
                          </div>
                          <CertificationInfoButton certKey="dot_number" />
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                          Optional
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-2">Department of Transportation identification number for safety monitoring</p>
                          <input
                            type="text"
                            placeholder="Enter DOT Number"
                            value={profileData.dotNumber || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProfileData(prev => ({ ...prev, dotNumber: value }));
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              autoSaveProfile('dotNumber', value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <input
                          id="dot-certificate-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDotNumberUpload(file);
                          }}
                        />
                        {isDocumentUploaded('dot_number_document') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('dot_number_document')}
                                data-testid="button-view-dot-document"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('dot_number_document')}
                                data-testid="button-download-dot-document"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('dot_number_document')}
                              data-testid="button-delete-dot-document"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('dot-certificate-input')?.click()}
                            disabled={uploadingDotNumber}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingDotNumber ? 'Uploading...' : 'Upload DOT Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* MC Number Card */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">MC Number</p>
                            <p className="text-xs text-gray-500 mt-1">Authority to operate as a for-hire carrier in interstate commerce</p>
                          </div>
                          <CertificationInfoButton certKey="mc_number" />
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                          Optional
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-2">Motor Carrier authority number for interstate commerce operations</p>
                          <input
                            type="text"
                            placeholder="Enter MC Number"
                            value={profileData.mcNumber || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProfileData(prev => ({ ...prev, mcNumber: value }));
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              autoSaveProfile('mcNumber', value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <input
                          id="mc-certificate-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMcNumberUpload(file);
                          }}
                        />
                        {isDocumentUploaded('mc_number_document') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('mc_number_document')}
                                data-testid="button-view-mc-document"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('mc_number_document')}
                                data-testid="button-download-mc-document"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('mc_number_document')}
                              data-testid="button-delete-mc-document"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('mc-certificate-input')?.click()}
                            disabled={uploadingMcNumber}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMcNumber ? 'Uploading...' : 'Upload MC Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Certifications Tab */}
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Certifications</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Upload your medical and healthcare-related certifications for gig work opportunities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Medical Courier Training Highlight */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src="https://integritydelivers.com/wp-content/uploads/2024/03/integrity_logo_horz_web.png" 
                          alt="Integrity Medical Courier Training"
                          className="h-8 object-contain"
                        />
                        <h4 className="font-semibold text-blue-900">🎓 Professional Medical Courier Training</h4>
                      </div>
                      <p className="text-sm text-blue-800 mb-3">
                        Get professionally certified in medical specimen handling, HIPAA compliance, and hazardous drug transportation. 
                        Integrity Medical Courier Training offers industry-leading courses designed specifically for courier drivers.
                      </p>
                      
                      {/* Available Courses */}
                      <div className="bg-white/50 rounded-lg p-3 mb-3">
                        <h5 className="font-medium text-blue-900 mb-2">📚 Available Courses:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Specimen Handling & Transportation Bundle</span>
                              <span className="text-blue-600 font-medium">$38.95</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Chemotherapy (Hazardous) Drugs</span>
                              <span className="text-blue-600 font-medium">$99.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Independent Contractor Membership</span>
                              <span className="text-blue-600 font-medium">$59.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Dental Transportation</span>
                              <span className="text-blue-600 font-medium">$29.95</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Starting Your Own Courier Business</span>
                              <span className="text-blue-600 font-medium">$19.95</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Medical Courier Financial Masterclass</span>
                              <span className="text-blue-600 font-medium">$39.00</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Essential Marketing Tips</span>
                              <span className="text-blue-600 font-medium">$29.95</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Administrative Recommendations</span>
                              <span className="text-blue-600 font-medium">$39.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Dispatchers Training Course</span>
                              <span className="text-blue-600 font-medium">$45.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• HIPAA-only Course</span>
                              <span className="text-blue-600 font-medium">$18.50</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-800">• Bloodborne Pathogen (BBP) Only</span>
                              <span className="text-blue-600 font-medium">$26.00</span>
                            </div>
                            <div className="text-blue-700 text-xs font-medium mt-2">+ Annual Renewal Courses Available</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">HIPAA Training</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Specimen Handling</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Bloodborne Pathogen</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Hazardous Drugs</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">OSHA Compliant</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Business Training</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a 
                          href="https://integritydelivers.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Get Professional Training
                        </a>
                        <a 
                          href="https://integritydeliverstraining.thinkific.com/bundles/combo" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Start with Bundle Course ($36.95)
                        </a>
                      </div>

                      <p className="text-xs text-blue-700 mt-2">
                        💼 <strong>Why get certified?</strong> Medical courier jobs typically pay 25-40% more than standard delivery gigs and offer more stable, dedicated routes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Medical Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-600" />
                    Core Medical Certifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* HIPAA Certification */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">HIPAA Certification</p>
                            <p className="text-xs text-gray-500 mt-1">Patient privacy and medical information handling</p>
                          </div>
                          <CertificationInfoButton certKey="hipaa_certification" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('hipaa_certification') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('hipaa_certification') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="hipaa-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'hipaa_certification', 'HIPAA Certification');
                          }}
                        />
                        {isDocumentUploaded('hipaa_certification') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('hipaa_certification')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('hipaa_certification')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('hipaa_certification')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('hipaa-cert-input')?.click()}
                            disabled={uploadingMedCert === 'hipaa_certification'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'hipaa_certification' ? 'Uploading...' : 'Upload HIPAA Certification'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* OSHA Bloodborne Pathogens */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">OSHA Bloodborne Pathogens</p>
                            <p className="text-xs text-gray-500 mt-1">Safe handling of specimens and infectious materials</p>
                          </div>
                          <CertificationInfoButton certKey="osha_bloodborne" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('osha_bloodborne') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('osha_bloodborne') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="osha-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'osha_bloodborne', 'OSHA Bloodborne Pathogens Certification');
                          }}
                        />
                        {isDocumentUploaded('osha_bloodborne') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('osha_bloodborne')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('osha_bloodborne')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('osha_bloodborne')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('osha-input')?.click()}
                            disabled={uploadingMedCert === 'osha_bloodborne'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'osha_bloodborne' ? 'Uploading...' : 'Upload OSHA Certification'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* OSHA Workplace Fire Safety Training */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">OSHA Workplace Fire Safety Training</p>
                            <p className="text-xs text-gray-500 mt-1">Fire prevention and emergency response procedures</p>
                          </div>
                          <CertificationInfoButton certKey="osha_fire_safety" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('osha_fire_safety') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('osha_fire_safety') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="osha-fire-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'osha_fire_safety', 'OSHA Workplace Fire Safety Training');
                          }}
                        />
                        {isDocumentUploaded('osha_fire_safety') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('osha_fire_safety')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('osha_fire_safety')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('osha_fire_safety')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('osha-fire-input')?.click()}
                            disabled={uploadingMedCert === 'osha_fire_safety'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'osha_fire_safety' ? 'Uploading...' : 'Upload OSHA Fire Safety Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* OSHA Hazard Communication (Haz-Com) Training */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">OSHA Hazard Communication (Haz-Com)</p>
                            <p className="text-xs text-gray-500 mt-1">Chemical hazard communication for medical couriers</p>
                          </div>
                          <CertificationInfoButton certKey="osha_hazcom" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('osha_hazcom') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('osha_hazcom') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="osha-hazcom-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'osha_hazcom', 'OSHA Hazard Communication (Haz-Com) Training');
                          }}
                        />
                        {isDocumentUploaded('osha_hazcom') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('osha_hazcom')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('osha_hazcom')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('osha_hazcom')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('osha-hazcom-input')?.click()}
                            disabled={uploadingMedCert === 'osha_hazcom'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'osha_hazcom' ? 'Uploading...' : 'Upload OSHA Haz-Com Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* CPR/First Aid */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">CPR/First Aid Certification</p>
                            <p className="text-xs text-gray-500 mt-1">American Red Cross or American Heart Association</p>
                          </div>
                          <CertificationInfoButton certKey="cpr_first_aid" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('cpr_first_aid') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('cpr_first_aid') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="cpr-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'cpr_first_aid', 'CPR/First Aid Certification');
                          }}
                        />
                        {isDocumentUploaded('cpr_first_aid') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('cpr_first_aid')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('cpr_first_aid')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('cpr_first_aid')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('cpr-input')?.click()}
                            disabled={uploadingMedCert === 'cpr_first_aid'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'cpr_first_aid' ? 'Uploading...' : 'Upload CPR/First Aid Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* HazMat Certification */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">HazMat Certification</p>
                            <p className="text-xs text-gray-500 mt-1">Hazardous Materials Transportation (DOT)</p>
                          </div>
                          <CertificationInfoButton certKey="hazmat_certification" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('hazmat_certification') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('hazmat_certification') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="hazmat-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'hazmat_certification', 'HazMat Certification');
                          }}
                        />
                        {isDocumentUploaded('hazmat_certification') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('hazmat_certification')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('hazmat_certification')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('hazmat_certification')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('hazmat-input')?.click()}
                            disabled={uploadingMedCert === 'hazmat_certification'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'hazmat_certification' ? 'Uploading...' : 'Upload HazMat Certification'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Medical Transport Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-green-600" />
                    Advanced Medical/Transport Certifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* IATA/DOT Dangerous Goods */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">IATA/DOT Dangerous Goods</p>
                            <p className="text-xs text-gray-500 mt-1">Air/ground specimen transportation certification</p>
                          </div>
                          <CertificationInfoButton certKey="iata_dot_certification" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('iata_dot_certification') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('iata_dot_certification') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="iata-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'iata_dot_certification', 'IATA/DOT Dangerous Goods Certification');
                          }}
                        />
                        {isDocumentUploaded('iata_dot_certification') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('iata_dot_certification')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('iata_dot_certification')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('iata_dot_certification')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('iata-input')?.click()}
                            disabled={uploadingMedCert === 'iata_dot_certification'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'iata_dot_certification' ? 'Uploading...' : 'Upload IATA/DOT Certification'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Specimen Handling */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Specimen Handling & Transport</p>
                            <p className="text-xs text-gray-500 mt-1">Collection, storage, and chain of custody</p>
                          </div>
                          <CertificationInfoButton certKey="specimen_handling" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('specimen_handling') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('specimen_handling') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="specimen-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'specimen_handling', 'Specimen Handling & Transport Certification');
                          }}
                        />
                        {isDocumentUploaded('specimen_handling') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('specimen_handling')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('specimen_handling')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('specimen_handling')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('specimen-input')?.click()}
                            disabled={uploadingMedCert === 'specimen_handling'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'specimen_handling' ? 'Uploading...' : 'Upload Specimen Handling Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Biohazard Training */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Biohazard & Infectious Substance</p>
                            <p className="text-xs text-gray-500 mt-1">Advanced training for high-risk materials</p>
                          </div>
                          <CertificationInfoButton certKey="biohazard_infectious" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('biohazard_infectious') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('biohazard_infectious') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="biohazard-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'biohazard_infectious', 'Biohazard & Infectious Substance Certification');
                          }}
                        />
                        {isDocumentUploaded('biohazard_infectious') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('biohazard_infectious')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('biohazard_infectious')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('biohazard_infectious')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('biohazard-input')?.click()}
                            disabled={uploadingMedCert === 'biohazard_infectious'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'biohazard_infectious' ? 'Uploading...' : 'Upload Biohazard Training Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* BioHazard Transport Training */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">BioHazard Transport Training</p>
                            <p className="text-xs text-gray-500 mt-1">Transport protocols and containment procedures</p>
                          </div>
                          <CertificationInfoButton certKey="biohazard_transport_training" />
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('biohazard_transport_training') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('biohazard_transport_training') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="biohazard-transport-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'biohazard_transport_training', 'BioHazard Transport Training Certification');
                          }}
                        />
                        {isDocumentUploaded('biohazard_transport_training') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('biohazard_transport_training')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('biohazard_transport_training')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('biohazard_transport_training')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('biohazard-transport-input')?.click()}
                            disabled={uploadingMedCert === 'biohazard_transport_training'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'biohazard_transport_training' ? 'Uploading...' : 'Upload BioHazard Transport Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Medical Waste Transportation */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Medical Waste Transportation</p>
                            <p className="text-xs text-gray-500 mt-1">Regulated medical waste handling</p>
                          </div>
                          <CertificationInfoButton certKey="medical_waste_transport" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('medical_waste_transport') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('medical_waste_transport') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="medwaste-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'medical_waste_transport', 'Medical Waste Transportation Certification');
                          }}
                        />
                        {isDocumentUploaded('medical_waste_transport') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('medical_waste_transport')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('medical_waste_transport')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('medical_waste_transport')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('medwaste-input')?.click()}
                            disabled={uploadingMedCert === 'medical_waste_transport'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'medical_waste_transport' ? 'Uploading...' : 'Upload Medical Waste Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Integrity Delivers Certificates */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Specimen Handling & Transportation</p>
                            <p className="text-xs text-gray-500 mt-1">Bloodborne Pathogen + HIPAA Bundle (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('specimen_handling_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('specimen_handling_cert') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="specimen-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'specimen_handling_cert', 'Specimen Handling Certificate');
                          }}
                        />
                        {isDocumentUploaded('specimen_handling_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('specimen_handling_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('specimen_handling_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('specimen_handling_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('specimen-cert-input')?.click()}
                            disabled={uploadingMedCert === 'specimen_handling_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'specimen_handling_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Chemotherapy (Hazardous) Drugs Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Chemotherapy (Hazardous) Drugs</p>
                            <p className="text-xs text-gray-500 mt-1">Safe handling & spill management (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('hazardous_drugs_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('hazardous_drugs_cert') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="hazardous-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'hazardous_drugs_cert', 'Hazardous Drugs Certificate');
                          }}
                        />
                        {isDocumentUploaded('hazardous_drugs_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('hazardous_drugs_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('hazardous_drugs_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('hazardous_drugs_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('hazardous-cert-input')?.click()}
                            disabled={uploadingMedCert === 'hazardous_drugs_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'hazardous_drugs_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* HIPAA-only Course Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">HIPAA-only Course</p>
                            <p className="text-xs text-gray-500 mt-1">Focused HIPAA training (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('hipaa_only_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('hipaa_only_cert') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="hipaa-only-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'hipaa_only_cert', 'HIPAA-only Course Certificate');
                          }}
                        />
                        {isDocumentUploaded('hipaa_only_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('hipaa_only_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('hipaa_only_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('hipaa_only_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('hipaa-only-cert-input')?.click()}
                            disabled={uploadingMedCert === 'hipaa_only_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'hipaa_only_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Bloodborne Pathogen (BBP) Only Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Bloodborne Pathogen (BBP) Only</p>
                            <p className="text-xs text-gray-500 mt-1">Standalone BBP training (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('bbp_only_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('bbp_only_cert') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="bbp-only-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'bbp_only_cert', 'BBP Only Course Certificate');
                          }}
                        />
                        {isDocumentUploaded('bbp_only_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('bbp_only_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('bbp_only_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('bbp_only_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('bbp-only-cert-input')?.click()}
                            disabled={uploadingMedCert === 'bbp_only_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'bbp_only_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dental Transportation Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Dental Transportation</p>
                            <p className="text-xs text-gray-500 mt-1">Specialized dental specimen handling (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('dental_transport_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-orange-600 border-orange-300 bg-orange-50"
                        }>
                          {isDocumentUploaded('dental_transport_cert') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="dental-transport-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'dental_transport_cert', 'Dental Transportation Certificate');
                          }}
                        />
                        {isDocumentUploaded('dental_transport_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('dental_transport_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('dental_transport_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('dental_transport_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('dental-transport-cert-input')?.click()}
                            disabled={uploadingMedCert === 'dental_transport_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'dental_transport_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety & Compliance Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                    Safety & Compliance Certifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Chain of Custody */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Chain of Custody Certification</p>
                            <p className="text-xs text-gray-500 mt-1">Drug test samples and forensic specimens</p>
                          </div>
                          <CertificationInfoButton certKey="chain_of_custody" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('chain_of_custody') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('chain_of_custody') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="custody-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'chain_of_custody', 'Chain of Custody Certification');
                          }}
                        />
                        {isDocumentUploaded('chain_of_custody') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('chain_of_custody')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('chain_of_custody')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('chain_of_custody')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('custody-input')?.click()}
                            disabled={uploadingMedCert === 'chain_of_custody'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'chain_of_custody' ? 'Uploading...' : 'Upload Chain of Custody Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dangerous Goods (DG) Certified */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Dangerous Goods (DG) Certified</p>
                            <p className="text-xs text-gray-500 mt-1">General dangerous goods handling and transport</p>
                          </div>
                          <CertificationInfoButton certKey="dangerous_goods_dg" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('dangerous_goods_dg') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('dangerous_goods_dg') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="dg-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'dangerous_goods_dg', 'Dangerous Goods (DG) Certification');
                          }}
                        />
                        {isDocumentUploaded('dangerous_goods_dg') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('dangerous_goods_dg')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('dangerous_goods_dg')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('dangerous_goods_dg')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('dg-input')?.click()}
                            disabled={uploadingMedCert === 'dangerous_goods_dg'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'dangerous_goods_dg' ? 'Uploading...' : 'Upload DG Certification'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dangerous Goods Class 7 (DG7) Certified */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Dangerous Goods Class 7 (DG7) Certified</p>
                            <p className="text-xs text-gray-500 mt-1">Radioactive materials handling and transport</p>
                          </div>
                          <CertificationInfoButton certKey="dangerous_goods_dg7" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('dangerous_goods_dg7') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('dangerous_goods_dg7') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="dg7-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'dangerous_goods_dg7', 'Dangerous Goods Class 7 (DG7) Certification');
                          }}
                        />
                        {isDocumentUploaded('dangerous_goods_dg7') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('dangerous_goods_dg7')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('dangerous_goods_dg7')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('dangerous_goods_dg7')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('dg7-input')?.click()}
                            disabled={uploadingMedCert === 'dangerous_goods_dg7'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'dangerous_goods_dg7' ? 'Uploading...' : 'Upload DG7 Certification'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Defensive Driving */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Defensive Driving Certification</p>
                            <p className="text-xs text-gray-500 mt-1">Insurance and liability requirements</p>
                          </div>
                          <CertificationInfoButton certKey="defensive_driving" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('defensive_driving') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('defensive_driving') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="defensive-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'defensive_driving', 'Defensive Driving Certification');
                          }}
                        />
                        {isDocumentUploaded('defensive_driving') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('defensive_driving')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('defensive_driving')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('defensive_driving')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('defensive-input')?.click()}
                            disabled={uploadingMedCert === 'defensive_driving'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'defensive_driving' ? 'Uploading...' : 'Upload Defensive Driving Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* OSHA General Industry */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">OSHA General Industry Training</p>
                            <p className="text-xs text-gray-500 mt-1">10-hour or 30-hour workplace safety card</p>
                          </div>
                          <CertificationInfoButton certKey="osha_general_industry" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('osha_general_industry') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('osha_general_industry') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="osha-general-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'osha_general_industry', 'OSHA General Industry Training Certification');
                          }}
                        />
                        {isDocumentUploaded('osha_general_industry') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('osha_general_industry')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('osha_general_industry')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('osha_general_industry')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('osha-general-input')?.click()}
                            disabled={uploadingMedCert === 'osha_general_industry'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'osha_general_industry' ? 'Uploading...' : 'Upload OSHA Training Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Cold Chain Management */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Cold Chain Management</p>
                            <p className="text-xs text-gray-500 mt-1">Temperature-sensitive medications and vaccines</p>
                          </div>
                          <CertificationInfoButton certKey="cold_chain_management" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('cold_chain_management') ? "text-green-600 border-green-300 bg-green-50" : "text-orange-600 border-orange-300 bg-orange-50"}>
                          {isDocumentUploaded('cold_chain_management') ? 'Uploaded' : 'Pending Upload'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="coldchain-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'cold_chain_management', 'Cold Chain Management Certification');
                          }}
                        />
                        {isDocumentUploaded('cold_chain_management') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('cold_chain_management')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('cold_chain_management')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('cold_chain_management')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('coldchain-input')?.click()}
                            disabled={uploadingMedCert === 'cold_chain_management'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'cold_chain_management' ? 'Uploading...' : 'Upload Cold Chain Cert'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Value-Adding Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-600" />
                    Optional Value-Adding Certifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phlebotomy Technician */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Phlebotomy Technician</p>
                            <p className="text-xs text-gray-500 mt-1">Blood sample handling credibility (optional)</p>
                          </div>
                          <CertificationInfoButton certKey="phlebotomy_tech" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('phlebotomy_technician') ? "text-green-600 border-green-300 bg-green-50" : "text-gray-600 border-gray-300 bg-gray-50"}>
                          {isDocumentUploaded('phlebotomy_technician') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="phlebotomy-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'phlebotomy_technician', 'Phlebotomy Technician Certification');
                          }}
                        />
                        {isDocumentUploaded('phlebotomy_technician') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('phlebotomy_technician')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('phlebotomy_technician')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('phlebotomy_technician')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('phlebotomy-input')?.click()}
                            disabled={uploadingMedCert === 'phlebotomy_technician'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'phlebotomy_technician' ? 'Uploading...' : 'Upload Phlebotomy Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Customer Service Training */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Customer Service Training</p>
                            <p className="text-xs text-gray-500 mt-1">Professionalism for medical environments</p>
                          </div>
                          <CertificationInfoButton certKey="customer_service_training" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('customer_service_training') ? "text-green-600 border-green-300 bg-green-50" : "text-gray-600 border-gray-300 bg-gray-50"}>
                          {isDocumentUploaded('customer_service_training') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="customer-service-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'customer_service_training', 'Customer Service Training Certification');
                          }}
                        />
                        {isDocumentUploaded('customer_service_training') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('customer_service_training')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('customer_service_training')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('customer_service_training')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('customer-service-input')?.click()}
                            disabled={uploadingMedCert === 'customer_service_training'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'customer_service_training' ? 'Uploading...' : 'Upload Customer Service Cert'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Independent Contractor Membership Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Independent Contractor Membership</p>
                            <p className="text-xs text-gray-500 mt-1">Business structure & compliance (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('independent_contractor_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-gray-600 border-gray-300 bg-gray-50"
                        }>
                          {isDocumentUploaded('independent_contractor_cert') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="independent-contractor-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'independent_contractor_cert', 'Independent Contractor Membership Certificate');
                          }}
                        />
                        {isDocumentUploaded('independent_contractor_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('independent_contractor_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('independent_contractor_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('independent_contractor_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('independent-contractor-cert-input')?.click()}
                            disabled={uploadingMedCert === 'independent_contractor_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'independent_contractor_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Starting Your Own Courier Business Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Starting Your Own Courier Business</p>
                            <p className="text-xs text-gray-500 mt-1">Entrepreneurship & business setup (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('courier_business_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-gray-600 border-gray-300 bg-gray-50"
                        }>
                          {isDocumentUploaded('courier_business_cert') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="courier-business-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'courier_business_cert', 'Starting Your Own Courier Business Certificate');
                          }}
                        />
                        {isDocumentUploaded('courier_business_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('courier_business_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('courier_business_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('courier_business_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('courier-business-cert-input')?.click()}
                            disabled={uploadingMedCert === 'courier_business_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'courier_business_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Medical Courier Financial Masterclass Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Medical Courier Financial Masterclass</p>
                            <p className="text-xs text-gray-500 mt-1">Financial planning & business growth (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('financial_masterclass_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-gray-600 border-gray-300 bg-gray-50"
                        }>
                          {isDocumentUploaded('financial_masterclass_cert') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="financial-masterclass-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'financial_masterclass_cert', 'Financial Masterclass Certificate');
                          }}
                        />
                        {isDocumentUploaded('financial_masterclass_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('financial_masterclass_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('financial_masterclass_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('financial_masterclass_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('financial-masterclass-cert-input')?.click()}
                            disabled={uploadingMedCert === 'financial_masterclass_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'financial_masterclass_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Essential Marketing Tips Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Essential Marketing Tips</p>
                            <p className="text-xs text-gray-500 mt-1">Business promotion & client acquisition (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('marketing_tips_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-gray-600 border-gray-300 bg-gray-50"
                        }>
                          {isDocumentUploaded('marketing_tips_cert') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="marketing-tips-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'marketing_tips_cert', 'Marketing Tips Certificate');
                          }}
                        />
                        {isDocumentUploaded('marketing_tips_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('marketing_tips_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('marketing_tips_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('marketing_tips_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('marketing-tips-cert-input')?.click()}
                            disabled={uploadingMedCert === 'marketing_tips_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'marketing_tips_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Administrative Recommendations Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Administrative Recommendations</p>
                            <p className="text-xs text-gray-500 mt-1">Operations & administrative best practices (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('admin_recommendations_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-gray-600 border-gray-300 bg-gray-50"
                        }>
                          {isDocumentUploaded('admin_recommendations_cert') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="admin-recommendations-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'admin_recommendations_cert', 'Administrative Recommendations Certificate');
                          }}
                        />
                        {isDocumentUploaded('admin_recommendations_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('admin_recommendations_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('admin_recommendations_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('admin_recommendations_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('admin-recommendations-cert-input')?.click()}
                            disabled={uploadingMedCert === 'admin_recommendations_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'admin_recommendations_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dispatchers Training Course Certificate */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Dispatchers Training Course</p>
                            <p className="text-xs text-gray-500 mt-1">Dispatch operations & coordination (Integrity Delivers)</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          isDocumentUploaded('dispatchers_training_cert') 
                            ? "text-green-600 border-green-300 bg-green-50" 
                            : "text-gray-600 border-gray-300 bg-gray-50"
                        }>
                          {isDocumentUploaded('dispatchers_training_cert') ? 'Uploaded' : 'Optional'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="dispatchers-training-cert-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'dispatchers_training_cert', 'Dispatchers Training Certificate');
                          }}
                        />
                        {isDocumentUploaded('dispatchers_training_cert') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('dispatchers_training_cert')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('dispatchers_training_cert')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('dispatchers_training_cert')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('dispatchers-training-cert-input')?.click()}
                            disabled={uploadingMedCert === 'dispatchers_training_cert'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'dispatchers_training_cert' ? 'Uploading...' : 'Upload Certificate'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom User-Defined Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Edit3 className="w-4 h-4 mr-2 text-blue-600" />
                    Custom Certifications
                    <span className="ml-2 text-xs text-gray-500 font-normal">(Click name to edit)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Custom Certification 1 */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1">
                            {editingCustom1 ? (
                              <input
                                type="text"
                                value={customCert1Name}
                                onChange={(e) => setCustomCert1Name(e.target.value)}
                                onBlur={() => setEditingCustom1(false)}
                                onKeyPress={(e) => e.key === 'Enter' && setEditingCustom1(false)}
                                className="text-sm font-semibold text-gray-800 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600 w-full"
                                autoFocus
                              />
                            ) : (
                              <p 
                                className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => setEditingCustom1(true)}
                              >
                                {customCert1Name}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">User-customizable certification</p>
                          </div>
                          <CertificationInfoButton certKey="custom_cert_1" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('custom_cert_1') ? "text-green-600 border-green-300 bg-green-50" : "text-gray-600 border-gray-300 bg-gray-50"}>
                          {isDocumentUploaded('custom_cert_1') ? 'Uploaded' : 'Custom'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="custom1-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'custom_cert_1', customCert1Name);
                          }}
                        />
                        {isDocumentUploaded('custom_cert_1') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('custom_cert_1')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('custom_cert_1')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('custom_cert_1')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('custom1-input')?.click()}
                            disabled={uploadingMedCert === 'custom_cert_1'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'custom_cert_1' ? 'Uploading...' : `Upload ${customCert1Name}`}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Custom Certification 2 */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1">
                            {editingCustom2 ? (
                              <input
                                type="text"
                                value={customCert2Name}
                                onChange={(e) => setCustomCert2Name(e.target.value)}
                                onBlur={() => setEditingCustom2(false)}
                                onKeyPress={(e) => e.key === 'Enter' && setEditingCustom2(false)}
                                className="text-sm font-semibold text-gray-800 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600 w-full"
                                autoFocus
                              />
                            ) : (
                              <p 
                                className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => setEditingCustom2(true)}
                              >
                                {customCert2Name}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">User-customizable certification</p>
                          </div>
                          <CertificationInfoButton certKey="custom_cert_2" />
                        </div>
                        <Badge variant="outline" className={isDocumentUploaded('custom_cert_2') ? "text-green-600 border-green-300 bg-green-50" : "text-gray-600 border-gray-300 bg-gray-50"}>
                          {isDocumentUploaded('custom_cert_2') ? 'Uploaded' : 'Custom'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <input
                          id="custom2-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMedicalCertUpload(file, 'custom_cert_2', customCert2Name);
                          }}
                        />
                        {isDocumentUploaded('custom_cert_2') ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDocument('custom_cert_2')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleDownloadDocument('custom_cert_2')}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteDocument('custom_cert_2')}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => document.getElementById('custom2-input')?.click()}
                            disabled={uploadingMedCert === 'custom_cert_2'}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingMedCert === 'custom_cert_2' ? 'Uploading...' : `Upload ${customCert2Name}`}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Address Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? (profileData.email ?? currentUser?.email ?? '') : (currentUser?.email ?? '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, email: value }));
                        if (isEditing) autoSaveProfile('email', value);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={isEditing ? (profileData.phone ?? profile.phone ?? '') : (profile.phone ?? '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, phone: value }));
                        if (isEditing) autoSaveProfile('phone', value);
                      }}
                      disabled={!isEditing}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={isEditing ? (profileData.address ?? profile.address ?? '') : (profile.address ?? '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, address: value }));
                        if (isEditing) autoSaveProfile('address', value);
                      }}
                      disabled={!isEditing}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={isEditing ? (profileData.city ?? profile.city ?? '') : (profile.city ?? '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, city: value }));
                        if (isEditing) autoSaveProfile('city', value);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={isEditing ? (profileData.state ?? profile.state ?? '') : (profile.state ?? '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, state: value }));
                        if (isEditing) autoSaveProfile('state', value);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={isEditing ? (profileData.zipCode ?? profile.zipCode ?? '') : (profile.zipCode ?? '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, zipCode: value }));
                        if (isEditing) autoSaveProfile('zipCode', value);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {isEditing && (
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Password Change Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          required
                          minLength={8}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Password must be at least 8 characters long</p>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                          minLength={8}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={updatePasswordMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </div>

                <Separator />

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Created</span>
                      <span>{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated</span>
                      <span>{currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-mono text-sm">{currentUser?.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
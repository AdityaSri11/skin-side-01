// test add right now 
import { Link } from "react-router-dom"; 
import logo from "@/assets/logo.png";     
//

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, FileText, Stethoscope } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { MedicalTermTooltip } from "@/components/MedicalTermTooltip";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [trials, setTrials] = useState<any[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check authentication and role
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/doctor-auth");
          return;
        }

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "doctor")
          .single();

        if (!roleData) {
          toast.error("Access denied. Doctor role required.");
          navigate("/");
          return;
        }

        // Get doctor's name from metadata
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        setDoctorName(`Dr. ${firstName} ${lastName}`);

        // Fetch clinical trials
        const { data: trialsData, error: trialsError } = await supabase
          .from("derm")
          .select("*")
          .order("Number", { ascending: false })
          .limit(50);

        if (trialsError) throw trialsError;
        setTrials(trialsData || []);

        // Count patients (users with patient role)
        const { count, error: countError } = await supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "patient");

        if (countError) throw countError;
        setPatientCount(count || 0);

      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-auth");
    toast.success("Signed out successfully");
  };

  const handleViewTrial = (trialNumber: string) => {
    navigate(`/trial/${trialNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-trust flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-trust py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              Doctor Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {doctorName}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card variant="healthcare">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clinical Trials</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trials.length}</div>
              <p className="text-xs text-muted-foreground">Available dermatology trials</p>
            </CardContent>
          </Card>

          <Card variant="healthcare">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientCount}</div>
              <p className="text-xs text-muted-foreground">Registered patients in system</p>
            </CardContent>
          </Card>
        </div>

        {/* Clinical Trials Table */}
        <Card variant="healthcare">
          <CardHeader>
            <CardTitle>Available Clinical Trials</CardTitle>
            <CardDescription>
              Browse and review active clinical trials for potential patient matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trial Number</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No trials available
                      </TableCell>
                    </TableRow>
                  ) : (
                    trials.map((trial) => (
                      <TableRow key={trial.Number}>
                        <TableCell className="font-medium">{trial.Number}</TableCell>
                        <TableCell>
                          <MedicalTermTooltip text={trial.Conditions || "N/A"} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <MedicalTermTooltip text={trial.Phase || "N/A"} />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              trial.Status === "Recruiting" ? "default" : 
                              trial.Status === "Ongoing" ? "secondary" : 
                              "outline"
                            }
                          >
                            {trial.Status || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {trial.Sponsor || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTrial(trial.Number)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;

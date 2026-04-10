import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth, useAuthStore } from "@/hooks/use-auth";
import { useDemoStore } from "@/store/demo";
import { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import LoginSuccess from "./pages/LoginSuccess";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RecruiterLayout } from "@/components/layout/RecruiterLayout";
import { CookieConsent } from "@/components/CookieConsent";
import { DemoTimeoutModal } from "@/components/DemoTimeoutModal";
import { useSystemTheme } from "@/hooks/use-system-theme";
import { I18nProvider } from "@/lib/i18n";

const Landing = lazy(() => import("@/pages/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
const Features = lazy(() => import("@/pages/Features"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const Jobs = lazy(() => import("@/pages/dashboard/Jobs"));
const Applications = lazy(() => import("@/pages/dashboard/Applications"));
const AITools = lazy(() => import("@/pages/dashboard/AITools"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const ResumePage = lazy(() => import("@/pages/dashboard/Resume"));
const ChatPage = lazy(() => import("@/pages/dashboard/Chat"));
const SubscriptionPage = lazy(() => import("@/pages/dashboard/Subscription"));
const JobAlerts = lazy(() => import("@/pages/dashboard/JobAlerts"));
const SavedJobs = lazy(() => import("@/pages/dashboard/SavedJobs"));
const Support = lazy(() => import("@/pages/dashboard/support"));
const RecruiterDashboard = lazy(() => import("@/pages/dashboard/recruiter/RecruiterDashboard"));
const BoostJobs = lazy(() => import("@/pages/dashboard/recruiter/BoostJobs"));
const PostJob = lazy(() => import("@/pages/dashboard/recruiter/PostJob"));
const RecruiterSetup = lazy(() => import("@/pages/dashboard/recruiter/RecruiterSetup"));
const RecruiterProfile = lazy(() => import("@/pages/dashboard/recruiter/RecruiterProfile"));
const RecruiterAnalytics = lazy(() => import("@/pages/dashboard/recruiter/RecruiterAnalytics"));
const EditJob = lazy(() => import("@/pages/dashboard/recruiter/EditJob"));
const RecruiterSubscription = lazy(() => import("@/pages/dashboard/recruiter/RecruiterSubscription"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminEmail = lazy(() => import("@/pages/admin/AdminEmail"));
const AdminNotifications = lazy(() => import("@/pages/admin/AdminNotifications"));

// Inject JWT token into all /api/ requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const url = typeof resource === "string" ? resource : resource instanceof Request ? resource.url : "";
  if (url.startsWith("/api/")) {
    const token = localStorage.getItem("hirenext_token");
    if (token) {
      config = config ? { ...config } : {};
      const headers = new Headers(config.headers as HeadersInit | undefined);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
  }
  return originalFetch(resource, config);
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading, token } = useAuth();
  const { isDemoMode, demoExpired } = useDemoStore();
  const [, setLocation] = useLocation();

  // Demo users (active or expired-but-modal-showing) bypass auth entirely.
  // When demoExpired, DemoTimeoutModal handles UX; user stays on current page
  // until they choose an exit action (Back to Home / Register / Sign In).
  const isDemo = isDemoMode || demoExpired;

  useEffect(() => {
    if (isDemo) return;
    if (!token) setLocation("/login");
    else if (!isLoading && !isAuthenticated) setLocation("/login");
  }, [isDemo, token, isLoading, isAuthenticated, setLocation]);

  if (isDemo) {
    return (
      <DashboardLayout>
        <Component />
      </DashboardLayout>
    );
  }

  if (!token) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading, token, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) { setLocation("/login"); return; }
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) setLocation("/dashboard/jobs");
  }, [token, isLoading, isAuthenticated, user, setLocation]);

  if (!token) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function RecruiterRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading, token, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) { setLocation("/login"); return; }
    if (!isLoading && (!isAuthenticated || user?.role !== "recruiter")) setLocation("/dashboard/jobs");
  }, [token, isLoading, isAuthenticated, user, setLocation]);

  if (!token) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "recruiter") return null;

  return (
    <RecruiterLayout>
      <Component />
    </RecruiterLayout>
  );
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, token, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (token && !isLoading && isAuthenticated) {
      const role = user?.role;
      setLocation(role === "admin" ? "/dashboard/admin" : role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/jobs");
    }
  }, [token, isLoading, isAuthenticated, user, setLocation]);

  if (token && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Component />;
}

function JobsWithRecruiterRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (!isLoading && user?.role === "recruiter") setLocation("/dashboard/recruiter");
  }, [isLoading, user, setLocation]);
  if (user?.role === "recruiter") return null;
  return <ProtectedRoute component={Jobs} />;
}

function DemoJobSeekerRoute() {
  const { enableDemo } = useDemoStore();
  useEffect(() => {
    enableDemo("job_seeker");
  }, [enableDemo]);
  return (
    <DashboardLayout>
      <Jobs />
    </DashboardLayout>
  );
}

function DemoRecruiterRoute() {
  const { enableDemo } = useDemoStore();
  useEffect(() => {
    enableDemo("recruiter");
  }, [enableDemo]);
  return (
    <DashboardLayout>
      <RecruiterDashboard />
    </DashboardLayout>
  );
}

function DashboardIndex() {

  const { setToken } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (token) {
      setToken(token)

      window.history.replaceState({}, document.title, "/dashboard")
    }
  }, [])

  return (
    <div style={{ color: "white", padding: "20px" }}>
      Dashboard loading...
    </div>
  )
}

function ScrollToTop() {
  const [pathname] = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/login" component={() => <PublicRoute component={Auth} />} />
      <Route path="/register" component={() => <PublicRoute component={Auth} />} />
      <Route path="/login-success" component={LoginSuccess} />
      <Route path="/dashboard" component={DashboardIndex} />
      <Route path="/demo/job-seeker" component={DemoJobSeekerRoute} />
      <Route path="/demo/recruiter" component={DemoRecruiterRoute} />
      <Route path="/dashboard/jobs" component={JobsWithRecruiterRedirect} />
      <Route path="/dashboard/applications" component={() => <ProtectedRoute component={Applications} />} />
      <Route path="/dashboard/ai-tools" component={() => <ProtectedRoute component={AITools} />} />
      <Route path="/dashboard/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/dashboard/resume" component={() => <ProtectedRoute component={ResumePage} />} />
      <Route path="/dashboard/chat" component={() => <ProtectedRoute component={ChatPage} />} />
      <Route path="/dashboard/subscription" component={() => <ProtectedRoute component={SubscriptionPage} />} />
      <Route path="/dashboard/recruiter/setup" component={RecruiterSetup} />
      <Route path="/dashboard/recruiter/boost-jobs" component={() => <RecruiterRoute component={BoostJobs} />} />
      <Route path="/dashboard/recruiter/post-job" component={() => <RecruiterRoute component={PostJob} />} />
      <Route path="/dashboard/recruiter/edit-job/:jobId" component={() => <RecruiterRoute component={EditJob} />} />
      <Route path="/dashboard/recruiter/analytics" component={() => <RecruiterRoute component={RecruiterAnalytics} />} />
      <Route path="/dashboard/recruiter/profile" component={() => <RecruiterRoute component={RecruiterProfile} />} />
      <Route path="/dashboard/recruiter/subscription" component={() => <RecruiterRoute component={RecruiterSubscription} />} />
      <Route path="/dashboard/recruiter" component={() => <RecruiterRoute component={RecruiterDashboard} />} />
      <Route path="/dashboard/job-alerts" component={() => <ProtectedRoute component={JobAlerts} />} />
      <Route path="/dashboard/saved-jobs" component={() => <ProtectedRoute component={SavedJobs} />} />
      <Route path="/dashboard/support" component={() => <ProtectedRoute component={Support} />} />
      <Route path="/dashboard/admin/users" component={() => <AdminRoute component={AdminUsers} />} />
      <Route path="/dashboard/admin/tickets" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route path="/dashboard/admin/announcements" component={() => <AdminRoute component={AdminEmail} />} />
      <Route path="/admin/announcements" component={() => <AdminRoute component={AdminEmail} />} />
      <Route path="/dashboard/admin/notifications" component={() => <AdminRoute component={AdminNotifications} />} />
      <Route path="/dashboard/admin/credits" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route path="/dashboard/admin" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useSystemTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
              <Router />
            </Suspense>
            <CookieConsent />
            <DemoTimeoutModal />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;

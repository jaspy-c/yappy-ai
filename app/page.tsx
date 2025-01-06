import LandingPage from "./landing-page";
import PageHeader  from "@/components/PageHeader";


export default function Home() {

  return (
    <div>
      <div>
        <PageHeader />
      </div>
      <div className="flex flex-col items-center justify-center">
        <LandingPage />
      </div>
    </div>      
  );
}

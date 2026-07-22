import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import CreateMatchForm from "../../components/forms/CreateMatchForm";

export default function CreateMatchPage() {
  return (
    <>
      <Layout>
        <CreateMatchForm />
      </Layout>

      <BottomNavigation />
    </>
  );
}
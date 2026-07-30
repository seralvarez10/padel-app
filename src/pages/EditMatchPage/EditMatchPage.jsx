import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import EditMatchForm from "../../components/forms/EditMatchForm";

export default function EditMatchPage() {
  return (
    <>
      <Layout>
        <EditMatchForm />
      </Layout>

      <BottomNavigation />
    </>
  );
}
import PropTypes from "prop-types";
import { Pencil } from "lucide-react";

import Button from "../../ui/Button";

export default function EditProfileButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      <Pencil size={18} />
      Editar perfil
    </Button>
  );
}

EditProfileButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
import PropTypes from "prop-types";
import {
  CircleCheck,
  CircleAlert,
  CircleX,
  CircleDashed,
} from "lucide-react";

import styles from "./MatchStatus.module.css";

const STATUS_CONFIG = {
  open: {
    label: "Abierto",
    icon: CircleCheck,
    className: "open",
  },

  almost_full: {
    label: "Últimas plazas",
    icon: CircleAlert,
    className: "almostFull",
  },

  full: {
    label: "Completo",
    icon: CircleX,
    className: "full",
  },

  cancelled: {
    label: "Cancelado",
    icon: CircleX,
    className: "cancelled",
  },

  finished: {
    label: "Finalizado",
    icon: CircleDashed,
    className: "finished",
  },
};

export default function MatchStatus({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.open;

  const Icon = config.icon;

  return (
    <div className={`${styles.status} ${styles[config.className]}`}>
      <Icon size={15} />
      <span>{config.label}</span>
    </div>
  );
}

MatchStatus.propTypes = {
  status: PropTypes.string.isRequired,
};
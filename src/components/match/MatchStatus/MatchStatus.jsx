import PropTypes from "prop-types";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
} from "lucide-react";

import { MATCH_STATUS } from "@/constants/matchStatus";

import styles from "./MatchStatus.module.css";


const STATUS_CONFIG = {
  [MATCH_STATUS.OPEN]: {
    label: "Abierto",
    icon: CircleCheck,
    className: "open",
  },

  [MATCH_STATUS.ALMOST_FULL]: {
    label: "Últimas plazas",
    icon: CircleAlert,
    className: "almostFull",
  },

  [MATCH_STATUS.FULL]: {
    label: "Completo",
    icon: CircleX,
    className: "full",
  },

  [MATCH_STATUS.CANCELLED]: {
    label: "Cancelado",
    icon: CircleX,
    className: "cancelled",
  },

  [MATCH_STATUS.FINISHED]: {
    label: "Finalizado",
    icon: CircleDashed,
    className: "finished",
  },
};

export default function MatchStatus({
    status = MATCH_STATUS.OPEN
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[MATCH_STATUS.OPEN];

  const Icon = config.icon;

  return (
    <div className={`${styles.status} ${styles[config.className]}`}>
      <Icon size={16} strokeWidth={2.3} />
      <span>{config.label}</span>
    </div>
  );
}

MatchStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(MATCH_STATUS)),
};
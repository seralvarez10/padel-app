import Avatar from "../../common/Avatar";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

import { MapPin, Star } from "lucide-react";

import styles from "./ProfileHeader.module.css";

export default function ProfileHeader() {
  return (
    <section className={styles.header}>

      <Avatar
        src="https://i.pravatar.cc/200"
        size="xl"
      />

      <h1>Sergio Álvarez</h1>

      <p className={styles.username}>
        @seralvarez2003
      </p>

      <Badge variant="success">
        ⭐ Nivel 3.5
      </Badge>

      <div className={styles.info}>

        <span>
          <MapPin size={16} />
          Oviedo
        </span>

        <span>
          <Star size={16} />
          4.8
        </span>

      </div>

      <Button>
        Editar perfil
      </Button>

    </section>
  );
}
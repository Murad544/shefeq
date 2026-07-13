import { Skeleton } from "@mui/material";
import { MdKey } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import SecretKeyCell from "../../../ui/Display/SecretKeyCell";

export default function SecretKeyInfo({ loading, secretKey }) {
  return (
    <InfoCard title="Gizli Açar" icon={<MdKey size={20} />}>
      {loading ? (
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
      ) : (
        <SecretKeyCell value={secretKey} />
      )}
    </InfoCard>
  );
}

import Image from "next/image";
import React, { useMemo } from "react";
import { minifyAddress } from "../helpers";

type Props = {
  seed: string;
};

const Avatar = ({ seed }: Props) => {
  const shortAddress = useMemo(() => minifyAddress(seed), [seed]);
  return (
    <div className="flex items-center border-2 border-app-primary px-2 rounded-full">
      <Image
        width={35}
        height={35}
        className="rounded-full overflow-hidden"
        src={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`}
      />
      <span className="m-2">{shortAddress}</span>
    </div>
  );
};

export default Avatar;

import React, { ReactElement } from 'react'
import Image from 'next/image';
import { DEFAULT_IMAGE } from '../../helpers/constants';

interface Props {
  altText: string
  userPhoto?: string | null;
  size?: {
    height?: string
    width?: string
  }
}

export default function Avatar({ altText, userPhoto, size = {} }: Props): ReactElement {
  return (
    <Image className="rounded-full border-white" src={userPhoto || DEFAULT_IMAGE} height={size.height || "50"} width={size.width || "50"} alt={`${altText} profile picture`} />
  )
}

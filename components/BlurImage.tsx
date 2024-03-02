import React, { FC, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import colors from '../colors';

export const NF_IMAGE_LOADER = ({ src, width }) => `${src}?nf_resize=fit&w=${width}`;

const DURATION = '0.3s';

export type Props = {
  isZoomable: boolean;
  src: string;
  alt?: string;
};

const StyledImage = styled(Image)(
  (props: Record<string, any>) => `
    transition: filter ${DURATION} ease-in-out, transform ${DURATION} ease-in-out, background ${DURATION} ease-in-out;
    filter: ${props['data-loading'] ? 'blur(1rem)grayscale(0.5)opacity(0.3)' : 'none'};
    transform: ${props['data-loading'] ? 'scale(1.1)' : 'none'};
    background: ${
      props['data-loading']
        ? 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);'
        : 'none'
    };
`
);

const BlurImage: FC<any> = (props: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [isZoomedLoading, setZoomedLoading] = useState(false);
  const [isZoomed, setZoomed] = useState(false);
  const { isZoomable, ...rest } = props;
  const handleToggleZoom = () => {
    if (!isZoomed) setZoomedLoading(true);
    if (isZoomable) {
      setZoomed(!isZoomed);
    }
  };
  if (isZoomed) {
    return (
      <Modal isOpen={isZoomed} onClose={handleToggleZoom} size="full" allowPinchZoom={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.alt}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="stretch"
            pb={10}
            onClick={handleToggleZoom}
            cursor="zoom-out"
          >
            <Flex position="relative" flexGrow={1} alignItems="center" justifyContent="center">
              <Image
                src={props.src}
                alt={props.alt}
                data-loading={isZoomedLoading}
                layout="fill"
                objectFit="contain"
                onLoadingComplete={() => setZoomedLoading(false)}
                loader={NF_IMAGE_LOADER}
              />
              {isZoomedLoading ? <Spinner color={colors.primary[2]} size="md" /> : null}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <StyledImage
      onClick={handleToggleZoom}
      {...rest}
      data-loading={isLoading}
      alt={props.alt}
      loader={NF_IMAGE_LOADER}
      onLoadingComplete={() => setLoading(false)}
      style={{ cursor: isZoomable ? 'zoom-in' : undefined }}
    />
  );
};

export default BlurImage;

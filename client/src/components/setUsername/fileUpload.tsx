import { useColorModeValue, Center, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload({ thePicture, ...props }: any) {
  const [profilePic, setProfilePic] = useState<any>({ preview: thePicture });

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(profilePic.preview);
    };
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [".png", ".jpeg"] },
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles) => {
      setProfilePic(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    },
  });

  const activeBg = useColorModeValue("pink.100", "pink.600");
  const borderColor = useColorModeValue(
    isDragActive ? "red.300" : "pink.300",
    isDragActive ? "red.500" : "pink.500"
  );
  return (
    <Center
      p={2}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius="full"
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Avatar boxSize="100px" objectFit="cover" src={profilePic.preview} {...props} />
    </Center>
  );
}

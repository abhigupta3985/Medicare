import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  VStack,
  Image,
  Flex,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { mockUploadPrescription } from '../../services/mockData';
import { updatePrescription } from '../../features/cart/cartSlice';
import { RootState } from '../../store';

interface PrescriptionUploadProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

const PrescriptionUpload = ({ 
  isOpen, 
  onClose, 
  productId,
  productName
}: PrescriptionUploadProps) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to upload prescriptions',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(selectedFile.type)) {
      setError('Please upload a valid image (JPEG, PNG) or PDF file');
      return;
    }
    
    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDF, just show an icon
      setPreview(null);
    }
  }, [user, toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': []
    },
  });
  
  const handleUpload = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Mock upload
      const downloadURL = await mockUploadPrescription(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update prescription URL in cart
      dispatch(updatePrescription({
        id: productId,
        prescriptionUrl: downloadURL,
      }));
      
      toast({
        title: 'Prescription uploaded',
        description: 'Your prescription has been successfully uploaded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setUploading(false);
      onClose();
    } catch (error) {
      setError('Error uploading file. Please try again.');
      setUploading(false);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your prescription.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Prescription</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              A valid prescription is required for <strong>{productName}</strong>. Please upload a clear image or PDF of your prescription.
            </Text>
            
            {!file ? (
              <Box
                {...getRootProps()}
                borderWidth={2}
                borderRadius="md"
                borderColor={isDragActive ? 'brand.500' : 'gray.300'}
                borderStyle="dashed"
                p={6}
                bg={isDragActive ? 'blue.50' : 'gray.50'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'brand.400', bg: 'blue.50' }}
              >
                <input {...getInputProps()} />
                <VStack spacing={3}>
                  <Box
                    bg={isDragActive ? 'blue.100' : 'gray.100'}
                    p={3}
                    borderRadius="full"
                  >
                    <Upload
                      size={24}
                      color={isDragActive ? '#3182ce' : '#718096'}
                    />
                  </Box>
                  <Text fontWeight="medium" textAlign="center">
                    {isDragActive
                      ? 'Drop your prescription here'
                      : 'Drag and drop your prescription here, or click to browse'}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Accepts JPG, PNG, and PDF (max 5MB)
                  </Text>
                </VStack>
              </Box>
            ) : (
              <Box
                borderWidth={1}
                borderRadius="md"
                borderColor="gray.200"
                overflow="hidden"
              >
                <Flex direction="column" align="center" p={4}>
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Prescription preview"
                      maxH="200px"
                      objectFit="contain"
                    />
                  ) : (
                    <Box p={4}>
                      <FileText size={64} color="#718096" />
                    </Box>
                  )}
                  
                  <Flex
                    mt={3}
                    w="full"
                    direction="column"
                    align="center"
                  >
                    <Text fontWeight="medium" noOfLines={1}>
                      {file.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                    
                    <Button
                      size="sm"
                      mt={3}
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                    >
                      Remove File
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            )}
            
            {error && (
              <Flex align="center" color="red.500" mt={2}>
                <AlertCircle size={16} style={{ marginRight: '8px' }} />
                <Text fontSize="sm">{error}</Text>
              </Flex>
            )}
            
            {uploading && (
              <Box mt={2}>
                <Text mb={1} fontSize="sm">
                  Uploading: {uploadProgress.toFixed(0)}%
                </Text>
                <Progress value={uploadProgress} size="sm" colorScheme="blue" />
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} isDisabled={uploading}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={uploading ? undefined : <Upload size={16} />}
            onClick={handleUpload}
            isLoading={uploading}
            loadingText="Uploading..."
            isDisabled={!file || uploading}
          >
            Upload Prescription
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrescriptionUpload;
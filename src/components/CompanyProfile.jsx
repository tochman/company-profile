import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { generateCompanyProfile } from "../services/apiService";

const CompanyProfile = () => {
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null); // State for audio playback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProfile(null); // Clear previous data
    setAudioUrl(null); // Clear previous audio
  };

  const addAudioElement = (blob) => {
    const audioFile = new File([blob], "recording.wav", { type: "audio/wav" });
    setFile(audioFile);
    setProfile(null); // Clear previous data

    // Create a URL for the recorded audio and save it in state
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    // Display toast notification when recording is finished
    toast({
      title: "Inspelning klar.",
      description: "Din inspelning har lagts till. Du kan nu spela upp den eller skicka den.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Ladda upp en fil eller spela in ljud.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileData = await generateCompanyProfile(file);
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Input type="file" onChange={handleFileChange} />
        <Text>eller spela in direkt:</Text>
        <AudioRecorder
          onRecordingComplete={addAudioElement}
          showVisualizer={true}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }} 
    
        />
      </HStack>

      {/* Display the playback controls if audioUrl is available */}
      {audioUrl && (
        <Box>
          <audio controls src={audioUrl}></audio>
        </Box>
      )}

      <Button onClick={handleSubmit} isLoading={loading} colorScheme="teal">
        Skapa presentation
      </Button>

      {error && <Text color="red.500">{error}</Text>}

      {profile && (
        <Box p={4} borderWidth={1} borderRadius="lg">
          <Text fontSize="xl" fontWeight="bold">
            {profile.company_name}
          </Text>

          <Text m={2}>
            <strong>Tjänster:</strong> {profile.services.join(", ")}
          </Text>

          <Text m={2}>
            <strong>Platser:</strong> {profile.locations.join(", ")}
          </Text>
          <Text m={2}>
            <strong>Original:</strong> {profile.original_transcription}
          </Text>
          <Text m={2}>
            <strong>Informell:</strong> {profile.informal_presentation}
          </Text>
          <Text m={2}>
            <strong>Formell:</strong> {profile.formal_presentation}
          </Text>
          <Text m={2}>
            <strong>Lång:</strong> {profile.long_presentation}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default CompanyProfile;

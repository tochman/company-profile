import { Container, Heading } from '@chakra-ui/react';
import CompanyProfile from './components/CompanyProfile';

function App() {
  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" mb={6}>
        Company Profile Generator
      </Heading>
      <CompanyProfile />
    </Container>
  );
}

export default App;

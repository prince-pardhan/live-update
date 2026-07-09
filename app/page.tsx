'use client';

import { useState } from 'react';
import { NewsList } from '@/components/NewsList';
import { Container, Title, Text, Group, ThemeIcon, TextInput, Paper } from '@mantine/core';
import { IconNews, IconSearch } from '@tabler/icons-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container fluid p={0}>
      {/* Header */}
      <Container size="xl" py="sl">
        <Group >
         
          
          <Paper p="1" withBorder radius="5" style={{ flex: '1', maxWidth: '400px', minWidth: '100px', background:"black" }}>
            <TextInput
              placeholder="Search news..."
              leftSection={<IconSearch size={16}  />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              styles={{
                
                input: {
                  border: '1px solid #000000',
                  backgroundColor: 'white',
                }
              }}
            />
          </Paper>
        </Group>
      </Container>

      {/* Main Content */}
      <NewsList searchQuery={searchQuery}  />
    </Container>
  );
}
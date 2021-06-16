import React, { FC } from 'react'
import { BiArrowBack, BiCheck, BiShow } from 'react-icons/bi'
import { getApiErrorMessage } from '../../api'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import {
  Link,
  Text,
  Tabs,
  TabList,
  Tab,
  IconButton,
  Button,
  Flex,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import { EmbedModal } from '.'
import { useCheckerContext } from '../../contexts'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { useStyledToast } from '../common/StyledToast'

const ROUTES = ['questions', 'constants', 'logic']

export const Navbar: FC = () => {
  const {
    isOpen: isBackPromptOpen,
    onOpen: onBackPromptOpen,
    onClose: onBackPromptClose,
  } = useDisclosure()
  const {
    isOpen: isEmbedOpen,
    onOpen: onEmbedOpen,
    onClose: onEmbedClose,
  } = useDisclosure()
  const history = useHistory()
  const styledToast = useStyledToast()
  const match = useRouteMatch<{ id: string; action: string }>({
    path: '/builder/:id/:action',
    exact: true,
  })
  const { save, publish, isChanged, config: checker } = useCheckerContext()

  const params = match?.params
  if (!params || !params.id || !params.action) {
    return <Redirect to="/dashboard" />
  }

  const index = ROUTES.indexOf(params.action)

  const checkBeforeBack = () => {
    if (!isChanged) {
      history.push('/dashboard')
    } else {
      onBackPromptOpen()
    }
  }

  const handleTabChange = (index: number) => {
    const id = match?.params.id
    if (id) history.push(`/builder/${id}/${ROUTES[index]}`)
  }

  const handleSave = async () => {
    try {
      await save.mutateAsync()
      styledToast({
        status: 'success',
        description: 'Your checker has been saved successfully.',
      })
    } catch (err) {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    }
  }

  const handlePublish = async () => {
    try {
      await publish.mutateAsync()
      styledToast({
        status: 'success',
        description: 'Your checker is now live.',
      })
    } catch (err) {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    }
  }

  return (
    <Flex
      h="80px"
      direction="row"
      bgColor="white"
      px={10}
      alignItems="center"
      position="fixed"
      w="100%"
      zIndex={999}
    >
      <HStack flex={1}>
        <IconButton
          onClick={checkBeforeBack}
          aria-label="Back"
          variant="ghost"
          icon={<BiArrowBack />}
        />
        <Modal isOpen={isBackPromptOpen} onClose={onBackPromptClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Discard changes?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              You have unsaved changes. Do you wish to discard them?
            </ModalBody>
            <ModalFooter>
              <Button onClick={onBackPromptClose} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={() => history.push('/dashboard')}
                colorScheme="error"
              >
                Discard
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Text fontWeight="600">{checker.title}</Text>
      </HStack>
      <HStack h="100%" flex={1} justifyContent="center" spacing={0}>
        <Tabs
          defaultIndex={0}
          onChange={handleTabChange}
          w="250px"
          h="100%"
          align="center"
          colorScheme="primary"
          isFitted
          index={index}
        >
          <TabList h="100%">
            {ROUTES.map((routeName) => (
              <Tab
                key={routeName}
                borderBottom="solid 4px"
                fontWeight="bold"
                textTransform="capitalize"
              >
                {routeName}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </HStack>
      <HStack flex={1} spacing={4} justifyContent="flex-end">
        <EmbedModal
          isEmbedOpen={isEmbedOpen}
          onEmbedOpen={onEmbedOpen}
          onEmbedClose={onEmbedClose}
          checker={checker}
          isChanged={isChanged}
        />
        <Link href={`/builder/${params.id}/preview`} isExternal>
          <DefaultTooltip label="Preview">
            <IconButton
              aria-label="Preview"
              variant="ghost"
              icon={<BiShow size="24px" />}
            />
          </DefaultTooltip>
        </Link>
        <Button
          variant="outline"
          leftIcon={!isChanged ? <BiCheck size="24px" /> : undefined}
          colorScheme="primary"
          onClick={handleSave}
          disabled={!isChanged}
          isLoading={save.isLoading}
        >
          {isChanged ? 'Save Draft' : 'Saved'}
        </Button>
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={handlePublish}
          isLoading={publish.isLoading}
        >
          Publish
        </Button>
      </HStack>
    </Flex>
  )
}

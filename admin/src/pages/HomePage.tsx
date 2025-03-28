import { Main } from "@strapi/design-system";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TFooter,
  Typography,
  Badge,
  EmptyStateLayout,
  Loader,
  Button,
  Flex,
} from "@strapi/design-system";
import { Cross, Eye } from "@strapi/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import { AuditLogEntry, AuditAction } from "../types";
import Modal from "../components/modal";
import Pagination from "../components/Pagination";

const getActionTextColor = (action: string): string => {
  switch (action) {
    case AuditAction.CREATE:
      return "success600";
    case AuditAction.UPDATE:
      return "primary600";
    case AuditAction.DELETE:
      return "danger600";
    default:
      return "neutral600";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

// Add interface for paginated response
interface PaginatedResponse {
  results: AuditLogEntry[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    pageCount: 1,
    total: 0,
  });

  const fetchAudits = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      let token =
        sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");

      if (token?.startsWith('"') && token?.endsWith('"')) {
        token = token.substring(1, token.length - 1);
      }

      const response = await axios.get<PaginatedResponse>("/audito/audits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page },
      });

      // Update state with the new response format
      setAuditLogs(response.data.results);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching audits", error);
      setError("Failed to load audit logs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // When page changes, fetch new data
  const handlePageChange = (pageNumber: number) => {
    fetchAudits(pageNumber);
  };

  useEffect(() => {
    fetchAudits(1); // Start with page 1
  }, []);

  const handleViewChanges = (id: number) => {
    setSelectedLogId(id);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedLogId(null);
  };

  if (isLoading) {
    return (
      <Box padding={8} background="neutral100" style={{ textAlign: "center" }}>
        <Loader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={8} background="neutral100">
        <EmptyStateLayout
          icon={<Cross />}
          content={error}
          action={
            <Button onClick={() => fetchAudits()} variant="secondary">
              Try again
            </Button>
          }
        />
      </Box>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <Box padding={8} background="neutral100">
        <EmptyStateLayout
          icon="layer"
          content="No audit logs found"
          action={
            <Button onClick={() => fetchAudits()} variant="secondary">
              Refresh
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <Main>
      <Box padding={8} background="neutral100">
        <Typography variant="alpha">Audit Logs</Typography>
        <br />
        <br />
        <br />
        <Table
          colCount={5}
          rowCount={auditLogs.length}
          footer={
            <TFooter>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                padding={3}
              >
                {pagination.pageCount > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    pageCount={pagination.pageCount}
                    onPageChange={handlePageChange}
                  />
                )}
              </Flex>
            </TFooter>
          }
        >
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Action</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Content Type</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">User</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Date</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Changes</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {auditLogs.map((log, index) => (
              <Tr key={`audit-log-${index}`}>
                <Td>
                  <Badge textColor={getActionTextColor(log.action)}>
                    {log.action}
                  </Badge>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {log.contentTypeName}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{log.userName}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {formatDate(log.createdAt)}
                  </Typography>
                </Td>
                <Td>
                  <Button
                    onClick={() => handleViewChanges(log.id)}
                    variant="tertiary"
                    startIcon={<Eye />}
                    size="S"
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Modal component */}
        <Modal
          id={selectedLogId}
          visible={isModalVisible}
          onClose={handleCloseModal}
        />
      </Box>
    </Main>
  );
};

export { HomePage };

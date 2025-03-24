import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(33, 33, 52, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  width: 80%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 4px rgba(33, 33, 52, 0.1);
`;

const ModalHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #eaeaef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #32324d;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666687;
  &:hover {
    color: #32324d;
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
  flex-grow: 1;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #eaeaef;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #dcdce4;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  color: #32324d;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f6f6f9;
    border-color: #d9d8ff;
  }

  &:active {
    background-color: #f0f0ff;
  }
`;

const CopyButton = styled(Button)`
  background-color: #4945ff;
  color: white;
  border: 1px solid #4945ff;
  margin-left: 8px;

  &:hover {
    background-color: #3933e4;
    border-color: #3933e4;
  }

  &:active {
    background-color: #271fe0;
  }
`;

// Styled component for the JSON display
const JSONDisplay = styled.pre`
  background-color: #f6f6f9;
  border-radius: 4px;
  padding: 16px;
  overflow: auto;
  max-height: 60vh;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;

  .json-key {
    color: #4945ff;
  }

  .json-string {
    color: #2da44e;
  }

  .json-number,
  .json-boolean,
  .json-null {
    color: #d02b20;
  }
`;

// Function to format JSON with syntax highlighting
const formatJSON = (json: any): JSX.Element => {
  if (!json) return <></>;

  // Convert JSON object to formatted string
  const formattedString = JSON.stringify(json, null, 2);

  // Apply syntax highlighting
  const highlighted = formattedString.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "json-key";
          match = match.replace(/:/g, "");
        } else {
          cls = "json-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );

  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

// Loading spinner
const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(73, 69, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4945ff;
  animation: spin 1s ease-in-out infinite;
  margin: 40px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: #d02b20;
  text-align: center;
  padding: 20px;
  font-size: 16px;
`;

interface ModalProps {
  id: number | null;
  visible: boolean;
  onClose: () => void;
}

const Modal = ({ id, visible, onClose }: ModalProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && id) {
      fetchData();
    }
    // Reset state when modal closes
    if (!visible) {
      setData(null);
      setError(null);
    }
  }, [visible, id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let token =
        sessionStorage.getItem("jwtToken") || localStorage.getItem("jwtToken");

      if (token?.startsWith('"') && token?.endsWith('"')) {
        token = token.substring(1, token.length - 1);
      }

      const response = await axios.get(`/audito/audits/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error("Error fetching audit details:", error);
      setError("Failed to load audit details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Record Details</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage>
              {error}
              <br />
              <Button onClick={fetchData} style={{ marginTop: "10px" }}>
                Try Again
              </Button>
            </ErrorMessage>
          ) : (
            <JSONDisplay>{formatJSON(data)}</JSONDisplay>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          {!loading && !error && data && (
            <CopyButton
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              }}
            >
              Copy to Clipboard
            </CopyButton>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

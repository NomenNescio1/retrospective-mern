import styled from 'styled-components';

export const ColumnsContainer = styled.div`
    display: flex;
    gap: 20px;
    margin: 20px;
    @media (max-width: 768px) {
        flex-direction: column;
      }
`;

export const ColumnElement = styled.div`
    flex: 1;
    background-color: ${(props: { bgColor: string }) => props.bgColor};
    padding: 8px;
    border-radius: 8px;
`;

export const CardElement = styled.div`
    margin-bottom: 10px;
    background-color: rgb(244, 247, 248, .8);
    padding: 10px; 0;
    border-radius: 8px;`;

export const OptionsContainer = styled.div`
    width: 100%;
    display: flex;
    padding: 10px;
    justify-content: flex-end;
    align-items: center;
`;
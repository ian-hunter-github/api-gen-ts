import { FC } from 'react';

interface TableFieldAdapterProps {
  value: unknown;
  onChange: (value: unknown) => void;
}

export const TableFieldAdapter: FC<TableFieldAdapterProps> = ({ value }) => {
  if (!value || typeof value !== 'object') return <div>No data</div>;
  
  const arrayValue = Array.isArray(value) ? value : [value];
  if (!arrayValue.length) return <div>No data</div>;

  const headers = Object.keys(arrayValue[0] || {});
  const getType = (val: unknown) => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  return (
    <div className="table-container">
      <table className="simple-table">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>
                {header}
                <div className="type-label">
                  {getType((arrayValue[0] as Record<string, unknown>)[header])}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arrayValue.map((row, i) => (
            <tr key={i}>
              {headers.map(header => (
                <td key={`${i}-${header}`}>
                  {JSON.stringify((row as Record<string, unknown>)[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

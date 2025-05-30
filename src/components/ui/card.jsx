import React from 'react';

export const Card = ({ className, children, ...props }) => (
  <div className={`bg-white rounded-lg shadow ${className || ''}`} {...props}>{children}</div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className || ''}`} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-xl font-semibold ${className || ''}`} {...props}>{children}</h3>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={`p-4 ${className || ''}`} {...props}>{children}</div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={`p-4 border-t border-gray-200 ${className || ''}`} {...props}>{children}</div>
);

// Neue statistische Karte für einheitliches Styling
export const StatCard = ({ 
  title, 
  value, 
  subValue, 
  valueClass,
  icon,
  isLoading = false,
  ...props 
}) => {
  const Icon = icon;
  
  return (
    <Card {...props}>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          {Icon && <Icon size={16} className="mr-1 text-blue-500" />}
          {title}
        </h3>
        {isLoading ? (
          <div className="animate-pulse h-8 bg-gray-200 rounded mt-1"></div>
        ) : (
          <p className={`text-2xl font-bold mt-1 ${valueClass || ''}`}>{value}</p>
        )}
        {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
};
'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', color: 'initial' }}>
            <div className="swagger-container">
                <SwaggerUI url="/api/doc" />
            </div>
        </div>
    );
};

export default ApiDocs;

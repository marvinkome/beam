import React from "react"

export function PageLoader() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <div className="loader" style={{ margin: 0 }} />
            <p style={{ paddingTop: 20 }}>Loading page...</p>
        </div>
    )
}

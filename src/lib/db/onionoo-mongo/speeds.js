module.exports = {
    FAST_EXIT: {
        // 95 Mbit/s
        BANDWIDTH_RATE: 95 * 125 * 1024,
        // 5000 kB/s
        ADVERTISED_BANDWIDTH: 5000 * 1024,
        PORTS: [80, 443, 554, 1755],
        MAX_PER_NETWORK: 2
    },
    FAST_EXIT_ANY_NETWORK: {
        // 95 Mbit/s
        BANDWIDTH_RATE: 95 * 125 * 1024,
        // 5000 kB/s
        ADVERTISED_BANDWIDTH: 5000 * 1024,
        PORTS: [80, 443, 554, 1755]
    },
    ALMOST_FAST_EXIT: {
        // 80 Mbit/s
        BANDWIDTH_RATE: 80 * 125 * 1024,
        // 2000 kB/s
        ADVERTISED_BANDWIDTH: 2000 * 1024,
        PORTS: [80, 443],
        NOT_FASTER: true
    }
};

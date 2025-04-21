# Define a build argument for the base image
ARG NODE_IMAGE=node:lts

# Stage for building the application
FROM ${NODE_IMAGE} as BUILDER

WORKDIR /app

COPY ./ /app

# Set the environment variable to use the custom npm binary path
ENV PATH="/usr/local/share/npm-global/bin:${PATH}"

# Stage for development
FROM ${NODE_IMAGE} as DEVELOPMENT

WORKDIR /app

COPY --from=BUILDER /app /app

# Set the environment variable to use the custom npm binary path
ENV PATH="/usr/local/share/npm-global/bin:${PATH}"

# Install dependencies with npm, force resolution
RUN npm install --force && npm cache clean --force

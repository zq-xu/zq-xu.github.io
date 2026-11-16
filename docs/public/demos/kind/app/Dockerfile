# syntax=docker/dockerfile:1

# Build stage: compile a static Linux binary.
FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/kind-demo .

# Runtime stage: run as a non-root user with no package manager.
FROM alpine:3.22
RUN addgroup -g 10001 -S app && adduser -u 10001 -S -G app app
COPY --from=build /out/kind-demo /kind-demo
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["/kind-demo"]

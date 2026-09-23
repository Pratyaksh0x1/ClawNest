#!/usr/bin/env bash
# ClawNest 1-Line Installer for macOS & Linux
# Set sail on the Grand Line of Code! 🏴‍☠️

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${YELLOW}"
cat << "EOF"
   _____ _                 _   _           _   
  / ____| |               | \ | |         | |  
 | |    | | __ ___      __|  \| | ___  ___| |_ 
 | |    | |/ _` \ \ /\ / /| . ` |/ _ \/ __| __|
 | |____| | (_| |\ V  V / | |\  |  __/\__ \ |_ 
  \_____|_|\__,_| \_/\_/  |_| \_|\___||___/\__|
       🏴‍☠️ THE KING OF AI PIRATES 🏴‍☠️
EOF
echo -e "${NC}"

echo -e "${CYAN}⚓ Ahoy, Captain! Preparing ClawNest for your vessel...${NC}\n"

# Check dependencies (Bun or Node.js)
INSTALL_DIR="$HOME/.clawnest"
BIN_DIR="$HOME/.local/bin"

if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}⚡ Bun not detected. Installing Bun (the fastest JS/TS runtime)...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is required to set sail. Please install git and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Fetching latest ClawNest logbook and tools...${NC}"
mkdir -p "$INSTALL_DIR"

if [ -d "$INSTALL_DIR/.git" ]; then
    echo -e "🔄 Updating existing ClawNest repository..."
    cd "$INSTALL_DIR" && git pull --quiet
else
    echo -e "🚀 Cloning ClawNest repository..."
    git clone --depth 1 https://github.com/Pratyaksh0x1/ClawNest.git "$INSTALL_DIR" --quiet
fi

cd "$INSTALL_DIR"
echo -e "${BLUE}🔨 Provisioning your pirate crew (installing dependencies)...${NC}"
bun install --frozen-lockfile 2>/dev/null || bun install

# Create executable wrapper
mkdir -p "$BIN_DIR"
WRAPPER="$BIN_DIR/clawnest"
cat << EOF > "$WRAPPER"
#!/usr/bin/env bash
exec bun run "$INSTALL_DIR/index.ts" "\$@"
EOF
chmod +x "$WRAPPER"

# Check PATH
case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *)
        SHELL_RC="$HOME/.bashrc"
        if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
            SHELL_RC="$HOME/.zshrc"
        fi
        echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_RC"
        echo -e "${YELLOW}💡 Added ~/.local/bin to your PATH in $SHELL_RC.${NC}"
        export PATH="$BIN_DIR:$PATH"
        ;;
esac

echo -e "\n${GREEN}✨ ClawNest is ready to conquer the Grand Line!${NC}"
echo -e "${BOLD}${YELLOW}Run the command below to wake up your AI crew:${NC}"
echo -e "  ${CYAN}clawnest wakeup${NC}\n"

# Offer immediate launch
if [ -t 0 ]; then
    read -p "Would you like to wake up ClawNest right now? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        "$WRAPPER" wakeup
    fi
fi

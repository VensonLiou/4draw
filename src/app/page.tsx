import NumberSelectGroup from "@/components/NumberSelectGroup/NumberSelectGroup";
import StepTitle from "@/components/Text/StepTitle";
import { HStack } from "@chakra-ui/react";
import styles from "./page.module.css";
import ContentContainer from "@/components/ContentContainer";
import StepContainer from "@/components/StepContainer";
import StepContentContainer from "@/components/StepContentContainer";

export default function Home() {
  return (
    <main className={styles.main}>
      <ContentContainer>
        <StepContainer>
          <StepTitle step={1} title="Choose your numbers" />
          <StepContentContainer>
            <HStack gap={6}>
              <NumberSelectGroup nthNumber={0} />
              <NumberSelectGroup nthNumber={1} />
              <NumberSelectGroup nthNumber={2} />
              <NumberSelectGroup nthNumber={3} />
            </HStack>
          </StepContentContainer>
        </StepContainer>
      </ContentContainer>
    </main>
  );
}
